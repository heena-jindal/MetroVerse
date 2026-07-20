FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python ml/train_model.py
EXPOSE 7860
CMD ["gunicorn", "app:app", "--workers", "2", "--bind", "0.0.0.0:7860", "--timeout", "120"]
