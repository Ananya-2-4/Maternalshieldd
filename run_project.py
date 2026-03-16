import os
import sys
import subprocess
import importlib.util

def check_dependencies():
    """Checks if required packages are installed."""
    required_packages = ['torch', 'pandas', 'streamlit', 'matplotlib', 'sklearn']
    missing_packages = []
    
    print("\n[1/3] Checking Dependencies...")
    for package in required_packages:
        spec = importlib.util.find_spec(package)
        if spec is None:
            # sklearn is imported as scikit-learn in pip
            install_name = 'scikit-learn' if package == 'sklearn' else package
            missing_packages.append(install_name)
            
    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        print("\nPlease run the following command to install them:")
        print(f"    pip install {' '.join(missing_packages)}")
        sys.exit(1)
    else:
        print("✅ All dependencies are installed.")

def check_and_train_model():
    """Checks for existing model weights, trains if missing."""
    model_weight_file = 'maternal_bilstm.pth'
    
    print(f"\n[2/3] Checking Model Weights ('{model_weight_file}')...")
    if not os.path.exists(model_weight_file):
        print("⚠️ Model weights not found. Initiating training sequence via `model_training.py`...")
        print("--- Training Output Start ---")
        try:
            # Run the training script and stream output
            subprocess.run([sys.executable, 'model_training.py'], check=True)
            print("--- Training Output End ---")
            print("✅ Model trained successfully.")
        except subprocess.CalledProcessError as e:
            print(f"❌ Error during model training. Please check your `model_training.py` script.\nDetailed Error: {e}")
            sys.exit(1)
    else:
        print(f"✅ Existing weights found ('{model_weight_file}'). Skipping training.")

def launch_dashboard():
    """Launches the Streamlit app."""
    app_file = 'app.py'
    
    print(f"\n[3/3] Launching Live Clinical Dashboard ('{app_file}')...")
    if not os.path.exists(app_file):
         print(f"❌ '{app_file}' not found in the current directory.")
         sys.exit(1)
         
    print("🚀 Firing up Streamlit Server in the default browser...")
    try:
         # Streamlit automatically opens the browser unless specified otherwise
         subprocess.run([sys.executable, '-m', 'streamlit', 'run', app_file], check=True)
    except subprocess.CalledProcessError as e:
         print(f"❌ Error launching Streamlit dashboard.\nDetailed Error: {e}")
         sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Dashboard shutdown requested by user.")

if __name__ == "__main__":
    print("=====================================================")
    print("     🛡️  MaternalShield: Build & Launch Sequence    ")
    print("=====================================================")
    
    check_dependencies()
    check_and_train_model()
    launch_dashboard()
