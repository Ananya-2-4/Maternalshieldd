import pandas as pd

csv_file = 'BiWeekly_Checkups.csv'
df = pd.read_csv(csv_file)

# Recalculate MAP and BP_Velocity for logical condition just in case they are missing from raw
if 'MAP' not in df.columns:
    df['MAP'] = (df['Systolic'] + 2 * df['Diastolic']) / 3

if 'BP_Velocity' not in df.columns:
    df['BP_Velocity'] = df.groupby('PatientID')['Systolic'].diff().fillna(0)

# 1. Add Is_High_Risk column
condition = (df['Systolic'] > 140) | ((df['MAP'] > 105) & (df['BP_Velocity'] > 2))
df['Is_High_Risk'] = condition.astype(int)

# 2. Add Target_Probability (Label Smoothing)
df['Target_Probability'] = df['Is_High_Risk'].apply(lambda x: 0.9 if x == 1 else 0.1)

df.to_csv(csv_file, index=False)
print("Successfully modified BiWeekly_Checkups.csv with Is_High_Risk and Target_Probability!")
