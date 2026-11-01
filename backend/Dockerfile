# Use official lightweight Python 3.12 image based on Debian
FROM python:3.12-slim

# Prevent Python from writing .pyc bytecode files and force unbuffered logging output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set the working directory inside container
WORKDIR /app

# Copy dependency requirements file first to take advantage of Docker layer caching
COPY requirements.txt .

# Install dependencies without caching downloaded wheel files to keep image size small
RUN pip install --no-cache-dir -r requirements.txt

# Create a system user and group (non-root) for security best practices
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy application source code into the container
COPY . .

# Change ownership of all files to the non-root user
RUN chown -R appuser:appgroup /app

# Switch from root user to our non-root user
USER appuser

# Expose port 8000 for Uvicorn web server
EXPOSE 8000

# Default command to run the FastAPI app (can be overridden by docker-compose)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

