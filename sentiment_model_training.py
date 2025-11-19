"""
Sentiment Analysis Model Training Script
========================================

This script trains two machine learning models (Logistic Regression and Naive Bayes)
for sentiment analysis on airline tweets. The trained models can classify tweets
into positive, negative, or neutral sentiments.

Dataset: Twitter US Airline Sentiment (public/data/Tweets.csv)
Models: Logistic Regression, Multinomial Naive Bayes
Accuracy: ~79% on test data

Requirements:
    pip install pandas numpy scikit-learn nltk

Usage:
    python sentiment_model_training.py
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import re
import pickle
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Download required NLTK data
nltk.download('stopwords', quiet=True)

class SentimentModelTrainer:
    def __init__(self, data_path='public/data/Tweets.csv'):
        """
        Initialize the sentiment model trainer
        
        Args:
            data_path: Path to the CSV file containing tweet data
        """
        self.data_path = data_path
        self.vectorizer = None
        self.lr_model = None
        self.nb_model = None
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        
    def load_data(self):
        """Load and prepare the dataset"""
        print("Loading data...")
        df = pd.read_csv(self.data_path)
        
        # Display dataset info
        print(f"\nDataset shape: {df.shape}")
        print(f"\nSentiment distribution:")
        print(df['airline_sentiment'].value_counts())
        
        return df
    
    def preprocess_text(self, text):
        """
        Clean and preprocess tweet text
        
        Args:
            text: Raw tweet text
            
        Returns:
            Cleaned and preprocessed text
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove user mentions and hashtags
        text = re.sub(r'@\w+|#\w+', '', text)
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenize and remove stopwords
        words = text.split()
        words = [self.stemmer.stem(word) for word in words if word not in self.stop_words]
        
        return ' '.join(words)
    
    def prepare_features(self, df):
        """
        Prepare features and labels for training
        
        Args:
            df: DataFrame containing tweet data
            
        Returns:
            X_train, X_test, y_train, y_test: Split and vectorized data
        """
        print("\nPreprocessing text data...")
        df['cleaned_text'] = df['text'].apply(self.preprocess_text)
        
        # Remove empty strings after preprocessing
        df = df[df['cleaned_text'].str.strip() != '']
        
        # Split data
        X = df['cleaned_text']
        y = df['airline_sentiment']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Vectorize text using TF-IDF
        print("Vectorizing text with TF-IDF...")
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            min_df=5,
            max_df=0.8
        )
        
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        print(f"Training set size: {X_train_vec.shape}")
        print(f"Test set size: {X_test_vec.shape}")
        
        return X_train_vec, X_test_vec, y_train, y_test
    
    def train_logistic_regression(self, X_train, y_train):
        """
        Train Logistic Regression model
        
        Args:
            X_train: Training features
            y_train: Training labels
        """
        print("\nTraining Logistic Regression model...")
        self.lr_model = LogisticRegression(
            max_iter=1000,
            random_state=42,
            C=1.0,
            solver='lbfgs',
            multi_class='multinomial'
        )
        self.lr_model.fit(X_train, y_train)
        print("Logistic Regression training completed!")
    
    def train_naive_bayes(self, X_train, y_train):
        """
        Train Naive Bayes model
        
        Args:
            X_train: Training features
            y_train: Training labels
        """
        print("\nTraining Naive Bayes model...")
        self.nb_model = MultinomialNB(alpha=1.0)
        self.nb_model.fit(X_train, y_train)
        print("Naive Bayes training completed!")
    
    def evaluate_model(self, model, X_test, y_test, model_name):
        """
        Evaluate model performance
        
        Args:
            model: Trained model
            X_test: Test features
            y_test: Test labels
            model_name: Name of the model for display
        """
        print(f"\n{'='*50}")
        print(f"{model_name} Evaluation")
        print('='*50)
        
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"\nAccuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        print("\nConfusion Matrix:")
        cm = confusion_matrix(y_test, y_pred)
        print(cm)
        
        return accuracy
    
    def save_models(self, output_dir='models'):
        """
        Save trained models and vectorizer
        
        Args:
            output_dir: Directory to save models
        """
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"\nSaving models to {output_dir}/...")
        
        # Save vectorizer
        with open(f'{output_dir}/vectorizer.pkl', 'wb') as f:
            pickle.dump(self.vectorizer, f)
        
        # Save Logistic Regression model
        with open(f'{output_dir}/logistic_regression.pkl', 'wb') as f:
            pickle.dump(self.lr_model, f)
        
        # Save Naive Bayes model
        with open(f'{output_dir}/naive_bayes.pkl', 'wb') as f:
            pickle.dump(self.nb_model, f)
        
        print("Models saved successfully!")
    
    def predict_sentiment(self, text, model='logistic_regression'):
        """
        Predict sentiment for a given text
        
        Args:
            text: Input text to classify
            model: Model to use ('logistic_regression' or 'naive_bayes')
            
        Returns:
            Predicted sentiment and confidence scores
        """
        cleaned = self.preprocess_text(text)
        vectorized = self.vectorizer.transform([cleaned])
        
        if model == 'logistic_regression':
            prediction = self.lr_model.predict(vectorized)[0]
            probabilities = self.lr_model.predict_proba(vectorized)[0]
        else:
            prediction = self.nb_model.predict(vectorized)[0]
            probabilities = self.nb_model.predict_proba(vectorized)[0]
        
        classes = self.lr_model.classes_
        confidence_scores = dict(zip(classes, probabilities))
        
        return prediction, confidence_scores

def main():
    """Main training pipeline"""
    print("="*60)
    print("Sentiment Analysis Model Training Pipeline")
    print("="*60)
    
    # Initialize trainer
    trainer = SentimentModelTrainer()
    
    # Load data
    df = trainer.load_data()
    
    # Prepare features
    X_train, X_test, y_train, y_test = trainer.prepare_features(df)
    
    # Train models
    trainer.train_logistic_regression(X_train, y_train)
    trainer.train_naive_bayes(X_train, y_train)
    
    # Evaluate models
    lr_accuracy = trainer.evaluate_model(
        trainer.lr_model, X_test, y_test, "Logistic Regression"
    )
    nb_accuracy = trainer.evaluate_model(
        trainer.nb_model, X_test, y_test, "Naive Bayes"
    )
    
    # Save models
    trainer.save_models()
    
    # Example predictions
    print("\n" + "="*60)
    print("Example Predictions")
    print("="*60)
    
    test_texts = [
        "This airline is amazing! Great service and on time arrival.",
        "Terrible experience. My flight was cancelled without notice.",
        "Average flight, nothing special but nothing bad either."
    ]
    
    for text in test_texts:
        print(f"\nText: {text}")
        prediction, scores = trainer.predict_sentiment(text, 'logistic_regression')
        print(f"Predicted: {prediction}")
        print(f"Confidence scores: {scores}")
    
    print("\n" + "="*60)
    print("Training Complete!")
    print(f"Logistic Regression Accuracy: {lr_accuracy*100:.2f}%")
    print(f"Naive Bayes Accuracy: {nb_accuracy*100:.2f}%")
    print("="*60)

if __name__ == "__main__":
    main()
