#!/usr/bin/env python3
"""
Debug script to check Docker environment and model loading.
"""

import os
import sys

def check_environment():
    """Check the Docker environment."""
    print("=== Docker Environment Debug Info ===")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python version: {sys.version}")
    print(f"PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not set')}")
    
    # Check if we're in Docker
    print(f"In Docker: {os.path.exists('/.dockerenv')}")
    
    # List files in current directory
    print("\nFiles in current directory:")
    for file in os.listdir('.'):
        print(f"  {file}")
    
    # Check ml-service directory
    print("\nChecking ml-service directory:")
    ml_service_path = '../ml-service'
    if os.path.exists(ml_service_path):
        print(f"  ml-service exists: True")
        print("  Contents:")
        for file in os.listdir(ml_service_path):
            print(f"    {file}")
            
        # Check models directory
        models_path = os.path.join(ml_service_path, 'models')
        if os.path.exists(models_path):
            print(f"  models directory exists: True")
            print("  Models contents:")
            for file in os.listdir(models_path):
                print(f"    {file}")
        else:
            print(f"  models directory exists: False")
    else:
        print(f"  ml-service exists: False")

def check_tensorflow():
    """Check if TensorFlow is available."""
    print("\n=== TensorFlow Check ===")
    try:
        import tensorflow as tf
        print(f"✅ TensorFlow version: {tf.__version__}")
        print("✅ TensorFlow is available")
        return True
    except ImportError as e:
        print(f"❌ TensorFlow not available: {e}")
        return False

def check_model_service():
    """Check if model service can be imported and initialized."""
    print("\n=== Model Service Check ===")
    try:
        from services.model_service import ModelService
        print("✅ ModelService imported successfully")
        
        # Try to initialize
        ms = ModelService()
        print("✅ ModelService initialized successfully")
        print("✅ Model loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ ModelService initialization failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    check_environment()
    tensorflow_available = check_tensorflow()
    model_service_works = check_model_service()
    
    print("\n=== Summary ===")
    if tensorflow_available:
        print("✅ TensorFlow: Available")
    else:
        print("❌ TensorFlow: Not available")
        
    if model_service_works:
        print("✅ Model Service: Working")
    else:
        print("❌ Model Service: Not working")
        
    if tensorflow_available and model_service_works:
        print("🎉 All systems operational!")
    else:
        print("⚠️  Issues detected - check above for details")