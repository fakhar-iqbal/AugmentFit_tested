pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "react-app:${BUILD_NUMBER}"
        CONTAINER_NAME = "react-app-container"
        APP_PORT = "8081"
        BASE_URL = "http://localhost:8081"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Build Application') {
            steps {
                echo 'Building React application Docker image...'
                script {
                    // Check if web-app directory and package.json exists
                    sh """
                        echo "Checking project structure..."
                        ls -la
                        
                        if [ ! -d "web-app" ]; then
                            echo "ERROR: web-app directory not found"
                            exit 1
                        fi
                        
                        if [ ! -f "web-app/package.json" ]; then
                            echo "ERROR: package.json not found in web-app directory"
                            echo "web-app directory contents:"
                            ls -la web-app/
                            exit 1
                        fi
                        
                        echo "Building Docker image..."
                        docker build -t ${DOCKER_IMAGE} .
                    """
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo 'Deploying application...'
                script {
                    // Stop and remove existing container if running
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        
                        # Run new container
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            -p ${APP_PORT}:80 \
                            ${DOCKER_IMAGE}
                        
                        # Wait for application to start
                        sleep 10
                        
                        # Health check
                        curl -f http://localhost:${APP_PORT} || exit 1
                    """
                }
            }
        }
        
        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                script {
                    sh """
                        # Create Python virtual environment
                        python3 -m venv selenium-env
                        source selenium-env/bin/activate
                        
                        # Install dependencies
                        cd selenium-tests
                        pip install -r requirements.txt
                        
                        # Set environment variable for base URL
                        export BASE_URL=${BASE_URL}
                        
                        # Run tests with HTML report
                        pytest --html=report.html --self-contained-html -v
                    """
                }
            }
            post {
                always {
                    // Archive test results
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'selenium-tests',
                        reportFiles: 'report.html',
                        reportName: 'Selenium Test Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed'
            
            // Clean up old Docker images
            script {
                sh """
                    docker images -q react-app | head -n -3 | xargs -r docker rmi || true
                """
            }
        }
        
        success {
            echo 'Pipeline succeeded! Application deployed successfully.'
            emailext (
                subject: "Jenkins Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Successful!</h2>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Application URL:</strong> <a href="http://your-ec2-public-ip:${APP_PORT}">http://your-ec2-public-ip:${APP_PORT}</a></p>
                    <p><strong>Test Report:</strong> Check Jenkins for detailed test results</p>
                    <p><strong>Build Time:</strong> ${currentBuild.durationString}</p>
                """,
                mimeType: 'text/html',
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'fakhar.iqbal@example.com'}"
            )
        }
        
        failure {
            echo 'Pipeline failed!'
            emailext (
                subject: "Jenkins Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Failed!</h2>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Console Output:</strong> <a href="${env.BUILD_URL}console">View Console</a></p>
                    <p>Please check the logs and fix the issues.</p>
                """,
                mimeType: 'text/html',
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'fakhar.iqbal@example.com'}"
            )
            
            // Stop container if deployment failed
            script {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                """
            }
        }
    }
}