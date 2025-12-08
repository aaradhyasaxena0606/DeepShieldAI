# Integration Tests

This directory contains integration tests for VoiceGuard AI's backend services and API endpoints.

## 📁 Test Files

```
tests/
├── test_api.py       # API endpoint tests
├── test_model.py     # ML model inference tests
└── test_rag.py       # RAG system tests
```

## 🧪 Test Coverage

### test_api.py - API Endpoint Tests

Tests for FastAPI endpoints and request/response handling:

- **Health Check**: `/health` endpoint availability
- **Audio Analysis**: `/analyze` endpoint with various audio formats
- **Video Analysis**: `/analyze-video` endpoint with video files
- **Error Handling**: Invalid inputs, missing files, malformed requests
- **Response Validation**: Schema compliance, status codes, data types

**Sample Test:**

```python
def test_analyze_audio_endpoint():
    # Test audio analysis with valid WAV file
    with open("sample.wav", "rb") as f:
        response = client.post("/analyze", files={"file": f})

    assert response.status_code == 200
    assert "prediction" in response.json()
    assert "confidence" in response.json()
```

### test_model.py - Model Inference Tests

Tests for ML model loading and prediction:

- **Model Loading**: Verify `best_model.h5` loads correctly
- **Preprocessing**: Test mel-spectrogram generation
- **Prediction**: Validate model output format and ranges
- **Performance**: Check inference time benchmarks
- **Edge Cases**: Empty audio, noise, silence

**Sample Test:**

```python
def test_model_prediction():
    # Load model and test inference
    model = load_model("ml-service/models/best_model.h5")
    test_input = np.random.rand(1, 128, 128, 3)

    prediction = model.predict(test_input)

    assert prediction.shape == (1, 1)
    assert 0 <= prediction[0][0] <= 1
```

### test_rag.py - RAG System Tests

Tests for Retrieval-Augmented Generation system:

- **Pattern Matching**: Verify pattern detection logic
- **Knowledge Base**: Test knowledge base queries
- **Gemini Integration**: Mock API calls and response parsing
- **Explanation Generation**: Validate explanation quality
- **Fallback Handling**: Test behavior when API fails

**Sample Test:**

```python
def test_pattern_matching():
    # Test pattern detection in model output
    patterns = detect_patterns(
        prediction=0.85,
        confidence=0.92,
        mel_spec_features=sample_features
    )

    assert isinstance(patterns, list)
    assert len(patterns) > 0
    assert all(isinstance(p, str) for p in patterns)
```

## 🚀 Running Tests

### Prerequisites

```bash
# Navigate to project root
cd VoiceGuard-AI

# Install test dependencies (if not already installed)
pip install pytest pytest-cov httpx
```

### Run All Tests

```bash
# Run all tests with pytest
pytest tests/

# Run with verbose output
pytest tests/ -v

# Run specific test file
pytest tests/test_api.py

# Run specific test function
pytest tests/test_api.py::test_analyze_audio_endpoint
```

### Run with Coverage

```bash
# Generate coverage report
pytest tests/ --cov=backend --cov-report=html

# View coverage report
# Open htmlcov/index.html in browser
```

### Run in Docker

```bash
# Run tests in Docker container
docker-compose exec backend pytest tests/

# Or build test container
docker build -f backend/Dockerfile --target test -t voiceguard-tests .
docker run voiceguard-tests
```

## 🔧 Test Configuration

### pytest Configuration

Create `pytest.ini` in project root:

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -v
    --strict-markers
    --tb=short
    --cov=backend
    --cov-report=term-missing
```

### Environment Variables for Tests

Create `tests/.env.test`:

```env
GEMINI_API_KEY=test_key_mock
MODEL_PATH=ml-service/models/best_model.h5
DECISION_THRESHOLD=0.5
TESTING=true
```

Load in tests:

```python
from dotenv import load_dotenv
load_dotenv("tests/.env.test")
```

## 📊 Test Utilities

### Sample Data

Create test fixtures for common test data:

```python
# tests/conftest.py
import pytest
import numpy as np

@pytest.fixture
def sample_audio():
    """Generate sample audio data"""
    return np.random.rand(32000)  # 2 seconds at 16kHz

@pytest.fixture
def sample_mel_spec():
    """Generate sample mel-spectrogram"""
    return np.random.rand(128, 128, 3)

@pytest.fixture
def mock_gemini_response():
    """Mock Gemini API response"""
    return {
        "explanation": "This audio shows signs of deepfake manipulation...",
        "confidence": 0.92
    }
```

### Mocking External Services

```python
# Mock Gemini API calls
from unittest.mock import patch, MagicMock

@patch('backend.rag.explainer.generate_explanation')
def test_rag_with_mock(mock_generate):
    mock_generate.return_value = "Mocked explanation"

    result = analyze_audio("sample.wav")

    assert result["explanation"] == "Mocked explanation"
    mock_generate.assert_called_once()
```

## 🐛 Debugging Tests

### Verbose Output

```bash
# Show print statements
pytest tests/ -s

# Show detailed failure info
pytest tests/ -vv

# Show locals in tracebacks
pytest tests/ -l
```

### Debug with PDB

```python
# Add breakpoint in test
def test_something():
    import pdb; pdb.set_trace()
    # Test code here
```

Run with:

```bash
pytest tests/test_api.py --pdb
```

### VS Code Debug Configuration

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Pytest: Current File",
      "type": "python",
      "request": "launch",
      "module": "pytest",
      "args": ["${file}", "-v"],
      "console": "integratedTerminal"
    }
  ]
}
```

## ✅ Best Practices

### 1. Test Organization

- One test file per module/service
- Group related tests in classes
- Use descriptive test names

### 2. Test Independence

- Each test should run independently
- Use fixtures for setup/teardown
- Don't rely on test execution order

### 3. Mock External Dependencies

- Mock API calls (Gemini, Firebase)
- Mock file system operations
- Use dependency injection

### 4. Assertions

- Test one thing per test function
- Use specific assertions
- Include failure messages

### 5. Coverage Goals

- Aim for >80% code coverage
- Focus on critical paths
- Test edge cases and errors

## 🔍 Common Issues

### Tests Fail Locally But Pass in CI

- Check environment differences
- Verify file paths (absolute vs relative)
- Check Python/package versions

### Slow Tests

- Use mocks for external services
- Cache expensive operations
- Run unit tests separately from integration tests

### Flaky Tests

- Avoid time-dependent tests
- Use deterministic test data
- Fix race conditions

## 📝 Adding New Tests

### Template for New Test File

```python
"""
Tests for [module_name] functionality
"""
import pytest
from backend.services.your_service import YourService

class TestYourService:
    """Test suite for YourService"""

    @pytest.fixture
    def service(self):
        """Create service instance"""
        return YourService()

    def test_basic_functionality(self, service):
        """Test basic service functionality"""
        result = service.do_something()
        assert result is not None

    def test_error_handling(self, service):
        """Test error handling"""
        with pytest.raises(ValueError):
            service.do_something_invalid()

    @pytest.mark.parametrize("input,expected", [
        (1, 2),
        (2, 4),
        (3, 6),
    ])
    def test_multiple_inputs(self, service, input, expected):
        """Test with multiple input values"""
        assert service.multiply(input) == expected
```

## 🔗 Related Documentation

- [Backend Testing Guide](../backend/tests/README.md) (if exists)
- [Pytest Documentation](https://docs.pytest.org/)
- [Python unittest.mock](https://docs.python.org/3/library/unittest.mock.html)

## 🤝 Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain >80% coverage
4. Document test purpose
5. Update this README if needed

---

For more information on the backend architecture, see [`backend/README.md`](../backend/README.md).
