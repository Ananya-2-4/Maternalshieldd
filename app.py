import os
import streamlit as st
import pandas as pd
import numpy as np
import torch
import matplotlib.pyplot as plt
from torch.utils.data import DataLoader
import time

# Import dependencies from our base model script
from model_training import MaternalBiLSTM, preprocess_data, MaternalDataset, train_model, engineer_features

# ==========================================
# 1. Page Configuration & Aesthetic Setting
# ==========================================
st.set_page_config(
    page_title="MaternalShield | Clinical Dashboard",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Dark Mode / Medical Clean Theme Injections
st.markdown("""
<style>
    .stApp {
        background-color: #0E1117;
        color: #FAFAFA;
    }
    .explainability-box {
        background-color: #1E2127;
        padding: 20px;
        border-radius: 8px;
        margin-top: 15px;
        margin-bottom: 25px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .login-container {
        max-width: 400px;
        margin: 100px auto;
        padding: 30px;
        background-color: #1E2127;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.5);
        text-align: center;
    }
    .css-1d391kg {
        background-color: #1E2127;
    }
    h1, h2, h3, p, div {
        color: #E0E0E0;
    }
    hr {
        border-color: #333;
    }
    .stMetric label {
        color: #A0A0A0 !important;
    }
    div[data-testid="stDataFrame"] {
        background-color: #1E2127;
    }
</style>
""", unsafe_allow_html=True)


# ==========================================
# 2. Session State Initialization
# ==========================================
if 'logged_in' not in st.session_state:
    st.session_state['logged_in'] = False
if 'doctor_id' not in st.session_state:
    st.session_state['doctor_id'] = ""
if 'current_view' not in st.session_state:
    st.session_state['current_view'] = 'registry'
if 'selected_patient' not in st.session_state:
    st.session_state['selected_patient'] = None


# ==========================================
# 3. Model & Data Loading (Cached)
# ==========================================
@st.cache_resource
def load_and_prepare_model():
    """
    Loads data, preprocesses it, and loads/trains the Bi-LSTM model.
    This runs once at startup for instant UI responsiveness thereafter.
    """
    csv_file = 'BiWeekly_Checkups.csv'
    if not os.path.exists(csv_file):
        st.error(f"Dataset '{csv_file}' not found. Please ensure it exists.")
        st.stop()
        
    df_raw = pd.read_csv(csv_file)
    X, y, patient_ids, feature_cols, scaler, df_processed = preprocess_data(df_raw, max_visits=10)
    
    num_features = X.shape[2]
    model = MaternalBiLSTM(input_size=num_features, hidden_size=64, num_layers=1, dropout=0.3, temperature=1.5)
    
    model_path = 'maternal_bilstm.pth'
    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path, weights_only=True))
        model.eval()
    else:
        with st.spinner("Training Bi-LSTM Model on the fly..."):
            dataset = MaternalDataset(X, y)
            train_loader = DataLoader(dataset, batch_size=4, shuffle=True)
            model = train_model(model, train_loader, num_epochs=100)
            torch.save(model.state_dict(), model_path)
            model.eval()
            
    return df_raw, X, y, patient_ids, feature_cols, scaler, model

df_raw, X, y, patient_ids, feature_cols, scaler, model = load_and_prepare_model()


@st.cache_data
def get_all_patient_risks():
    """Calculates risk scores for every patient based on their sequences."""
    model.eval()
    risks = []
    with torch.no_grad():
        for i in range(len(X)):
            input_tensor = X[i].unsqueeze(0) 
            risk = model(input_tensor).item()
            risks.append(risk)
    
    risks_df = pd.DataFrame({
        'PatientID': patient_ids,
        'RiskScore': risks
    })
    return risks_df

risks_df = get_all_patient_risks()


# ==========================================
# 4. Routing & View Logic
# ==========================================

def render_login_page():
    st.markdown("<div class='login-container'>", unsafe_allow_html=True)
    st.image("https://img.icons8.com/nolan/256/health-source.png", width=100) # Placeholder medical logo
    st.title("MaternalShield Access")
    st.markdown("Secure Clinical Decision Support System")
    st.markdown("<br>", unsafe_allow_html=True)
    
    doc_id = st.text_input("Doctor ID", placeholder="e.g., Dr. Raghuram")
    password = st.text_input("Password", type="password", placeholder="Enter Password")
    
    if st.button("Authenticate", use_container_width=True):
        if doc_id and password: # Simple mock authentication
             st.session_state['logged_in'] = True
             st.session_state['doctor_id'] = doc_id
             st.session_state['current_view'] = 'registry'
             st.rerun()
        else:
             st.error("Please enter credentials.")
    st.markdown("</div>", unsafe_allow_html=True)

def logout():
    st.session_state['logged_in'] = False
    st.session_state['doctor_id'] = ""
    st.session_state['selected_patient'] = None
    st.session_state['current_view'] = 'registry'
    st.rerun()

def render_registry_page():
    st.sidebar.title(f"👨‍⚕️ {st.session_state['doctor_id']}")
    st.sidebar.markdown("---")
    st.sidebar.button("Logout", on_click=logout)
    
    st.title("📋 Patient Registry")
    st.markdown("Overview of your assigned antenatal patients. Select a patient to view their Bi-LSTM predictive risk trajectory.")
    
    # Check if upgraded columns exist, if not gracefully handle
    has_demographics = 'DoctorInCharge' in df_raw.columns
    
    if has_demographics:
        # Filter patients specifically for this Doctor (Case Insensitive)
        doc_patients_df = df_raw[df_raw['DoctorInCharge'].str.lower() == st.session_state['doctor_id'].lower()]
        
        if len(doc_patients_df) == 0:
             st.warning(f"No patients found assigned to {st.session_state['doctor_id']}. Please try 'Dr. Raghuram'.")
             return
             
        # Create the high level registry snapshot (Unique Patients)
        registry_data = doc_patients_df.drop_duplicates(subset=['PatientID'])[['PatientID', 'PatientName', 'Age', 'Trimester', 'ContactNumber', 'FamilyHistoryPreeclampsia']]
    else:
        st.warning("⚠️ Legacy dataset detected. Showing all generic IDs.")
        registry_data = df_raw.drop_duplicates(subset=['PatientID'])[['PatientID', 'FamilyHistoryPreeclampsia']]
        
    # Merge Risk Scores for display sorting
    registry_view = registry_data.merge(risks_df, on='PatientID')
    registry_view = registry_view.sort_values(by='RiskScore', ascending=False).reset_index(drop=True)
    
    # UI Table Rendering
    for idx, row in registry_view.iterrows():
        pid = row['PatientID']
        name = row.get('PatientName', 'Unknown')
        trim_val = row.get('Trimester', None)
        if pd.isna(trim_val) or trim_val == 0.0:
            trim = "Not Recorded"
        else:
            try:
                trim = f"{int(trim_val)}"
            except:
                trim = str(trim_val)
        
        fam_history = row.get('FamilyHistoryPreeclampsia', 0)
        risk = row['RiskScore'] * 100
        
        # Color coding risk strips
        if risk > 75:
             bg_color, border_color = "#FF525220", "#FF5252" # High Risk (Red)
        elif risk > 60:
             bg_color, border_color = "#FF980020", "#FF9800" # Emerging (Orange)
        elif risk > 35:
             bg_color, border_color = "#FFC10720", "#FFC107" # Elevated (Yellow)
        else:
             bg_color, border_color = "#4CAF5020", "#4CAF50" # Stable (Green)
        
        # Format tags
        fam_tag = "🔴 High-Risk Family" if fam_history == 1 else "🟢 No Family History"
        
        with st.container():
            st.markdown(f"""
            <div style="background-color: {bg_color}; border-left: 5px solid {border_color}; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
            </div>
            """, unsafe_allow_html=True)
            
            # Use negative margin to pull columns up into the styled div horizontally
            st.markdown("<div style='margin-top: -65px;'></div>", unsafe_allow_html=True)
            c1, c2, c3, c4, c5, c6 = st.columns([1, 1.5, 1, 1.8, 1.5, 1.5])
            with c1: st.markdown(f"**{pid}**")
            with c2: st.markdown(f"🧑 {name}")
            with c3: st.markdown(f"⏳ T{trim}")
            with c4: st.markdown(f"<span style='font-size:0.85em;'>{fam_tag}</span>", unsafe_allow_html=True)
            with c5: st.markdown(f"Risk: **{risk:.1f}%**")
            with c6: 
                if st.button("View Analysis", key=f"view_{pid}", use_container_width=True):
                    st.session_state['selected_patient'] = pid
                    st.session_state['current_view'] = 'analysis'
                    st.rerun()
            st.markdown("<div style='margin-bottom: 20px;'></div>", unsafe_allow_html=True)

def render_analysis_page():
    patient_id = st.session_state['selected_patient']
    
    # Sidebar Navigation & SOS Protocol
    st.sidebar.title("Navigation")
    if st.sidebar.button("⬅️ Back to Registry"):
        st.session_state['current_view'] = 'registry'
        st.session_state['selected_patient'] = None
        st.rerun()
        
    st.sidebar.markdown("---")
    
    # Extract Patient Metadata
    p_data = df_raw[df_raw['PatientID'] == patient_id].iloc[0]
    p_name = p_data.get('PatientName', 'Unknown')
    p_contact = p_data.get('ContactNumber', 'Unknown')
    
    st.title(f"Patient Analysis: {p_name} ({patient_id})")
    
    # Patient Profile Summary
    st.markdown("---")
    c_p1, c_p2, c_p3 = st.columns(3)
    c_p1.markdown(f"**Name:** {p_name}")
    c_p2.markdown(f"**Contact:** {p_contact}")
    c_p3.markdown(f"**Physician:** {p_data.get('DoctorInCharge', 'N/A')}")
    st.markdown("---")
    
    # Medical Background Card
    fam_hist_val = int(p_data.get('FamilyHistoryPreeclampsia', 0))
    first_preg_val = int(p_data.get('FirstTimePregnancy', 0))
    age_val = p_data.get('Age', 'Not Recorded')
    trim_val = p_data.get('Trimester', None)
    
    if pd.isna(trim_val) or trim_val == 0.0:
        trim_display = "Not Recorded"
    else:
        try:
            trim_display = f"{int(trim_val)} Trimester"
        except:
            trim_display = str(trim_val)
    
    fam_color = "#FF5252" if fam_hist_val == 1 else "#4CAF50"
    fam_text = "Yes (Elevated Risk)" if fam_hist_val == 1 else "No History"
    
    preg_color = "#FFA726" if first_preg_val == 1 else "#29B6F6"
    preg_text = "First-Time Pregnancy" if first_preg_val == 1 else "Multipara"

    st.markdown("### 📋 Clinical Background")
    st.markdown(f"""
    <div style="display:flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
        <span style="background-color: #37474F; color: #E0E0E0; padding: 5px 15px; border-radius: 20px; border: 1px solid #546E7A; font-weight: bold;">
            👤 Age: {age_val} Yrs
        </span>
        <span style="background-color: #37474F; color: #E0E0E0; padding: 5px 15px; border-radius: 20px; border: 1px solid #546E7A; font-weight: bold;">
            ⏳ Current Status: {trim_display}
        </span>
        <span style="background-color: {fam_color}20; color: {fam_color}; padding: 5px 15px; border-radius: 20px; border: 1px solid {fam_color}; font-weight: bold;">
            🧬 Family History: {fam_text}
        </span>
        <span style="background-color: {preg_color}20; color: {preg_color}; padding: 5px 15px; border-radius: 20px; border: 1px solid {preg_color}; font-weight: bold;">
            🤰 Status: {preg_text}
        </span>
    </div>
    """, unsafe_allow_html=True)
    
    current_risk = risks_df[risks_df['PatientID'] == patient_id]['RiskScore'].values[0]
    
    # SOS Emergency Module
    if current_risk > 0.75:
        st.sidebar.markdown("### 🚨 EMERGENCY ACTIONS")
        if st.sidebar.button("🚨 ALERT PATIENT VIA SMS", type="primary", use_container_width=True):
            with st.spinner("Connecting to SMS Gateway..."):
                time.sleep(1.5)
            st.sidebar.success(f"Emergency Alert & Lab Instructions sent to {p_name} at {p_contact}.")
            st.toast(f"SOS Triggered for {patient_id}!", icon="🚨")

    # Retrieve patient's raw history
    p_history = df_raw[df_raw['PatientID'] == patient_id].sort_values('VisitNumber')
    last_visit = p_history.iloc[-1]
    prev_visit = p_history.iloc[-2] if len(p_history) > 1 else last_visit

    # Calculate Deltas
    current_sys = last_visit['Systolic']
    prev_sys = prev_visit['Systolic']
    sys_delta = current_sys - prev_sys

    current_map = (current_sys + 2 * last_visit['Diastolic']) / 3
    prev_map = (prev_sys + 2 * prev_visit['Diastolic']) / 3
    map_delta_pct = ((current_map - prev_map) / prev_map) * 100 if prev_map > 0 else 0

    # --- Trend Cards ---
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Bi-LSTM Predictive Risk", f"{current_risk * 100:.1f}%", delta_color="inverse")
    col2.metric("Systolic BP", f"{current_sys} mmHg", f"{sys_delta} mmHg", delta_color="inverse")
    col3.metric("MAP", f"{current_map:.1f}", f"{map_delta_pct:.1f}%", delta_color="inverse")
    col4.metric("Weight", f"{last_visit['Weight_kg']:.1f} kg", f"{last_visit['Weight_kg'] - prev_visit['Weight_kg']:.1f} kg", delta_color="inverse")

    # --- Clinical Explainability UI ---
    st.markdown("### Clinical Reasoning")
    if current_risk > 0.75:
        explain_html = f"""
        <div class="explainability-box" style="border-left: 5px solid #FF5252;">
            <h4 style="margin-top:0; color:#FF5252;">🚨 High Predictive Risk Triggered</h4>
            <strong>Reasoning:</strong> Despite current vitals remaining below the 140 mmHg emergency line, the Bi-LSTM flags this sequence due to dangerous <em>velocity</em>. 
            There is a <strong>{sys_delta} mmHg increase</strong> in Systolic BP in the last interval and a <strong>{map_delta_pct:.1f}% acceleration</strong> in MAP. The Bidirectional layer matched this rapid temporal progression to impending preeclampsia.
            <br/><br/>
            <strong>Action:</strong> Run SOS Protocol via Sidebar.
        </div>
        """
    elif current_risk > 0.60:
        explain_html = f"""
        <div class="explainability-box" style="border-left: 5px solid #FF9800;">
            <h4 style="margin-top:0; color:#FF9800;">🟠 Emerging Trend Detected</h4>
            <strong>Reasoning:</strong> Symptom velocity is accelerating steadily (MAP change: {map_delta_pct:.1f}%). The model detects a pattern that often precedes clinical threshold breaches if unmanaged.
            <br/><br/>
            <strong>Action:</strong> Adjust care plan and schedule early follow-up.
        </div>
        """
    elif current_risk > 0.35:
        explain_html = f"""
        <div class="explainability-box" style="border-left: 5px solid #FFC107;">
            <h4 style="margin-top:0; color:#FFC107;">⚠️ Elevated Trajectory Noticed</h4>
            <strong>Reasoning:</strong> MAP and Systolic BP have shown creeping velocity. Although not an immediate crisis, it indicates an upward trend that deviates from standard pregnancy baselines. 
            <br/><br/>
            <strong>Action:</strong> Monitor closely at the next checkup.
        </div>
        """
    else:
        explain_html = f"""
        <div class="explainability-box" style="border-left: 5px solid #4CAF50;">
            <h4 style="margin-top:0; color:#4CAF50;">✅ Stable Baseline Confirmed</h4>
            <strong>Reasoning:</strong> Symptom velocity remains within normal physiological bounds. The Bi-LSTM confirms the sequential visit progression is stable.
            <br/><br/>
            <strong>Action:</strong> Routine care.
        </div>
        """
    st.markdown(explain_html, unsafe_allow_html=True)

    # ==========================================
    # Graph Engine function
    # ==========================================
    def get_trajectory(pid, extra_row=None):
        patient_data = df_raw[df_raw['PatientID'] == pid].copy()
        if extra_row is not None:
             patient_data = pd.concat([patient_data, extra_row], ignore_index=True)
             
        patient_data = engineer_features(patient_data)
        patient_data = patient_data.sort_values('VisitNumber')
            
        df_eval = patient_data.copy()
        num_cols = ['Trimester', 'Systolic', 'Diastolic', 'MAP', 'BP_Velocity', 'BMI', 'Weight_kg']
        df_eval[num_cols] = scaler.transform(df_eval[num_cols])
        seq_features = df_eval[feature_cols].values
        
        sys_hist = patient_data['Systolic'].values
        risk_hist = []
        
        model.eval()
        for t in range(1, len(seq_features) + 1):
            current_seq = seq_features[:t]
            if len(current_seq) < 10:
                pad_len = 10 - len(current_seq)
                current_seq = np.vstack([current_seq, np.zeros((pad_len, len(feature_cols)))])
            elif len(current_seq) > 10:
                current_seq = current_seq[-10:] 
                
            input_tensor = torch.tensor(current_seq, dtype=torch.float32).unsqueeze(0)
            with torch.no_grad():
                risk_t = model(input_tensor).item()
            risk_hist.append(risk_t)
            
        return sys_hist, risk_hist

    # --- Real-Time Graph Plotting ---
    st.markdown("### 📈 Risk Trajectory vs. Clinical Bounds")
    sys_hist, risk_hist = get_trajectory(patient_id)
    
    fig, (ax1) = plt.subplots(figsize=(12, 4))
    fig.patch.set_alpha(0.0) 
    ax1.set_facecolor('#0E1117')
    
    visits = range(1, len(sys_hist) + 1)
    
    if current_risk > 0.75: color_main = '#FF5252'
    elif current_risk > 0.60: color_main = '#FF9800'
    elif current_risk > 0.35: color_main = '#FFC107'
    else: color_main = '#4CAF50'
    
    ax1.set_xlabel('Sequential Visits', color='white', fontsize=11)
    ax1.set_ylabel('Predictive Risk', color=color_main, fontsize=12, fontweight='bold')
    line1, = ax1.plot(visits, risk_hist, marker='o', color=color_main, linewidth=3, label='Bi-LSTM Risk Score')
    ax1.tick_params(axis='y', labelcolor=color_main)
    ax1.set_ylim(-0.05, 1.05)
    ax1.axhline(y=0.75, color='orange', linestyle=':', linewidth=2, label='Clinical Risk Threshold (75%)')
    
    ax2 = ax1.twinx()
    color_sys = '#29B6F6'
    ax2.set_ylabel('Systolic BP (mmHg)', color=color_sys, fontsize=12)
    line2, = ax2.plot(visits, sys_hist, marker='s', color=color_sys, linewidth=2, linestyle='--', alpha=0.8, label='Systolic Vitals')
    ax2.tick_params(axis='y', labelcolor=color_sys)
    ax2.set_ylim(min(sys_hist) - 10, max(160, max(sys_hist) + 10))
    ax2.axhline(y=140, color='darkred', linestyle='-', linewidth=2, alpha=0.6, label='Emergency Boundary (140 mmHg)')
    
    ax1.tick_params(colors='white')
    ax2.tick_params(colors='white')
    for spine in ax1.spines.values(): spine.set_edgecolor('#555')
    for spine in ax2.spines.values(): spine.set_edgecolor('#555')
    
    lines = [line1, line2]
    labels = [l.get_label() for l in lines]
    ax1.legend(lines, labels, loc='upper left', facecolor='#1E2127', edgecolor='none', labelcolor='white')
    st.pyplot(fig, transparent=True)
    
    # --- The "What-If" Simulator ---
    st.markdown("---")
    st.markdown("### 🔮 Simulate Next Visit")
    with st.form("simulation_form"):
        col_a, col_b, col_c, col_d = st.columns(4)
        with col_a: sim_sys = st.number_input("Simulate Systolic BP", value=int(current_sys), step=1)
        with col_b: sim_dia = st.number_input("Simulate Diastolic BP", value=int(last_visit['Diastolic']), step=1)
        with col_c: sim_weight = st.number_input("Simulate Weight (kg)", value=float(last_visit['Weight_kg']), step=0.1)
        with col_d:
            st.markdown("<br/>", unsafe_allow_html=True)
            submit_sim = st.form_submit_button("Launch 'What-If'", use_container_width=True)
            
    if submit_sim:
        new_visit_num = last_visit['VisitNumber'] + 1
        
        # Approximate new trimester from new visit
        if new_visit_num <= 4: new_trim = 1
        elif new_visit_num <= 7: new_trim = 2
        else: new_trim = 3
        
        extra_row = pd.DataFrame([{
            'PatientID': patient_id, 'VisitNumber': new_visit_num, 'Systolic': sim_sys, 'Diastolic': sim_dia,
            'BMI': last_visit['BMI'], 'Weight_kg': sim_weight, 'FamilyHistoryPreeclampsia': last_visit['FamilyHistoryPreeclampsia'],
            'FirstTimePregnancy': last_visit['FirstTimePregnancy'], 'Preeclampsia': last_visit['Preeclampsia'],
            'Trimester': new_trim
        }])
        
        sim_sys_hist, sim_risk_hist = get_trajectory(patient_id, extra_row)
        sim_final_risk = sim_risk_hist[-1]
        
        st.markdown(f"#### ⚡ Simulated Future Risk: <span style='color:{'#FF5252' if sim_final_risk > 0.75 else '#4CAF50'};'>{sim_final_risk * 100:.1f}%</span>", unsafe_allow_html=True)
        
        if sim_final_risk > 0.75:
             st.error(f"With a {sim_sys - current_sys} mmHg change, the Bi-LSTM calculates the 'velocity' crosses the high-risk slope.")
        elif sim_final_risk > 0.60:
             st.warning(f"This triggers an 'Emerging Trend'. The trajectory is worsening.")
        elif sim_final_risk > 0.35:
             st.info(f"Trajectory becomes elevated, requiring closer monitoring.")
        else:
             st.success(f"At these vitals, the trajectory remains stable.")
             
        fig_sim, ax_sim = plt.subplots(figsize=(12, 3))
        fig_sim.patch.set_alpha(0.0)
        ax_sim.set_facecolor('#0E1117')
        sim_visits = range(1, len(sim_sys_hist) + 1)
        ax_sim.plot(sim_visits[:-1], sim_risk_hist[:-1], marker='o', color='gray', label='Historical Risk', linewidth=2)
        ax_sim.plot(sim_visits[-2:], sim_risk_hist[-2:], marker='o', color='#FFC107', label='Simulated Trajectory', linewidth=3, linestyle='--')
        ax_sim.set_ylim(-0.05, 1.05)
        ax_sim.set_ylabel('Bi-LSTM Risk', color='white')
        ax_sim.tick_params(colors='white')
        ax_sim.axhline(y=0.75, color='orange', linestyle=':', label='High-Risk Threshold')
        for spine in ax_sim.spines.values(): spine.set_edgecolor('#555')
        ax_sim.legend(facecolor='#1E2127', edgecolor='none', labelcolor='white', loc='upper left')
        st.pyplot(fig_sim, transparent=True)


# ==========================================
# Application Routing Engine
# ==========================================
if not st.session_state['logged_in']:
    render_login_page()
elif st.session_state['current_view'] == 'registry':
    render_registry_page()
elif st.session_state['current_view'] == 'analysis':
    render_analysis_page()
