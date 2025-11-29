# VoiceGuard AI - CNN Model Architecture Definition
# build_cnn(): Define Keras Sequential model:
# Input: (128, 128, 1), Conv2D(32, 3x3, ReLU) → MaxPool → Conv2D(64, 3x3, ReLU) → MaxPool → Conv2D(128, 3x3, ReLU) → MaxPool
# Flatten → Dense(128, ReLU) → Dropout(0.5) → Dense(2, Softmax)
# Compile with Adam(lr=0.001), loss='binary_crossentropy', metrics=['accuracy']
# Return compiled model ready for training

