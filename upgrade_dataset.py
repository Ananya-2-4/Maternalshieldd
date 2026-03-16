import pandas as pd
import numpy as np
import random

csv_file = 'BiWeekly_Checkups.csv'
df = pd.read_csv(csv_file)

# We need to map new columns for the upgrade: DoctorInCharge, ContactNumber, Age, Name
if 'DoctorInCharge' not in df.columns:
    print("Upgrading dataset with DoctorInCharge, ContactNumber, PatientName, Age...")
    
    # Generate unique demographics per PatientID
    unique_patients = df['PatientID'].unique()
    
    patient_names = ['Aditi', 'Neha', 'Priya', 'Ananya', 'Sneha', 'Riya', 'Ishita', 'Kavya', 'Meera', 'Pooja',
                     'Radhika', 'Sakshi', 'Tanvi', 'Vanya', 'Zara', 'Bhavya', 'Chahat', 'Divya', 'Esha', 'Falguni']
    
    doctors = ['Dr. Raghuram', 'Dr. Sharma', 'Dr. Patel', 'Dr. Gupta']
    
    demographics = []
    np.random.seed(42)
    random.seed(42)
    
    for pid in unique_patients:
        # Give Dr. Raghuram the specific patients requested
        if pid in ['P001', 'P002', 'P003', 'P004', 'P005']:
            doc = 'Dr. Raghuram'
            name = patient_names[int(pid.replace('P', '')) - 1]
        else:
            doc = random.choice(doctors)
            name = patient_names[int(pid.replace('P', '')) - 1] 

        age = np.random.randint(22, 38)
        contact = f"+91 {np.random.randint(90000, 99999)}{np.random.randint(10000, 99999)}"
        # Mocking Trimester (1, 2, or 3)
        trimester = np.random.randint(1, 4)
        
        demographics.append({
            'PatientID': pid,
            'PatientName': name,
            'Age': age,
            'ContactNumber': contact,
            'DoctorInCharge': doc,
            'Trimester': trimester
        })

    demo_df = pd.DataFrame(demographics)
    
    # Merge into main dataset
    df = df.merge(demo_df, on='PatientID', how='left')
    df.to_csv(csv_file, index=False)
    print("Dataset upgraded successfully.")
else:
    print("Dataset already contains upgraded columns.")
