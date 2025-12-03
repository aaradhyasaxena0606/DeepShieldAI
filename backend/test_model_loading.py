#!/usr/bin/env python3
"""
Test script to verify model loading in Docker environment.
"""

import os
import sys

def test_model_paths():
    """Test various paths where the model might be located."""
    print("Testing model loading...")
    print("=" * 50)
    
    # Print current working directory
    print(f"Current working directory: {os.getcwd()}")
    
    # Test paths
    paths_to_check = [
        os.path.join(os.path.dirname(__file__), '..', 'ml-service', 'models', 'best_model.h5'),
        os.path.join('/app', 'ml-service', 'models', 'best_model.h5'),
        os.path.join(os.path.dirname(__file__), '..', 'ml-service', 'trained_models', 'cnn_model.h5'),
        os.path.join('/app', 'ml-service', 'trained_models', 'cnn_model.h5')
    ]
    
    for path in paths_to_check:
        exists = os.path.exists(path)
        print(f"Path: {path}")
        print(f"Exists: {exists}")
        if exists:
            print(f"✅ Found model file at: {path}")
            return path
        print("-" * 30)
    
    print("❌ Model file not found in any expected location")
    return None

def test_ml_service_import():
    """Test importing and initializing the model service."""
    print("\nTesting ML Service Import...")
    print("=" * 50)
    
    try:
        from services.model_service import ModelService
        print("✅ Successfully imported ModelService")
        
        # Try to initialize
        ms = ModelService()
        print("✅ Successfully initialized ModelService")
        print("✅ Model loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to initialize ModelService: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Model Loading Test Script")
    print("=" * 50)
    
    # Test paths
    model_path = test_model_paths()
    
    # Test service import
    service_works = test_ml_service_import()
    
    print("\n" + "=" * 50)
    print("SUMMARY:")
    if model_path:
        print(f"✅ Model file found at: {model_path}")
    else:
        print("❌ Model file NOT found")
        
    if service_works:
        print("✅ ML Service working correctly")
    else:
        print("❌ ML Service NOT working")
    print("=" * 50)