pipeline {
    agent any
    
    environment {
        NODE_OPTIONS = "--max_old_space_size=4096"
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
                    sh '''
                        echo "Checking project structure..."
                        ls -la
                        
                        if [ ! -d "web-app" ]; then
                            echo "Error: web-app directory not found"
                            exit 1
                        fi
                        
                        if [ ! -f "web-app/package.json" ]; then
                            echo "Error: package.json not found in web-app directory"
                            exit 1
                        fi
                        
                        echo "Building Docker image..."
                        docker build -t react-app:${BUILD_NUMBER} .
                    '''
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo 'Deploying application...'
                script {
                    sh '''
                        # Stop and remove existing container if it exists
                        docker stop react-app-container || true
                        docker rm react-app-container || true
                        
                        # Run new container with current build number
                        docker run -d --name react-app-container -p 8081:80 react-app:${BUILD_NUMBER}
                        
                        # Wait for container to start
                        sleep 10
                        
                        # Test if application is running
                        curl -f http://localhost:8081
                    '''
                }
            }
        }
        
        stage('Setup Python Environment') {
            steps {
                echo 'Setting up Python environment for Selenium tests...'
                script {
                    sh '''
                        # Install python3-venv if not already installed
                        if ! dpkg -l | grep -q python3-venv; then
                            echo "Installing python3-venv..."
                            sudo apt update
                            sudo apt install -y python3-venv python3-pip
                        fi
                        
                        # Create virtual environment
                        python3 -m venv selenium-env
                        
                        # Activate virtual environment and install dependencies
                        . selenium-env/bin/activate
                        
                        # Install required Python packages
                        pip install --upgrade pip
                        pip install selenium pytest pytest-html webdriver-manager
                        
                        # Verify installation
                        python --version
                        pip list
                    '''
                }
            }
        }
        
        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                script {
                    sh '''
                        # Activate virtual environment
                        . selenium-env/bin/activate
                        
                        # Navigate to selenium tests directory
                        cd selenium-tests
                        
                        # Run tests and generate HTML report
                        pytest --html=report.html --self-contained-html || true
                        
                        # Move report to workspace root for publishing
                        mv report.html ../selenium-test-report.html || true
                    '''
                }
            }
        }
    }
    
    post {
        success {
            emailext (
                subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                <h2>Build Successful!</h2>
                <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                <p><strong>Build Status:</strong> SUCCESS</p>
                <p><strong>Build Duration:</strong> ${currentBuild.durationString}</p>
                <p><strong>Application URL:</strong> <a href="http://localhost:8081">http://localhost:8081</a></p>
                <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                <p><strong>Console Output:</strong> <a href="${env.BUILD_URL}console">View Console</a></p>
                """,
                to: 'fakhareiqbal3534@gmail.com', // Change this to your real email
                mimeType: 'text/html'
            )
        }
        
        failure {
            emailext (
                subject: "❌ FAILED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                <h2>Build Failed!</h2>
                <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                <p><strong>Build Status:</strong> FAILURE</p>
                <p><strong>Build Duration:</strong> ${currentBuild.durationString}</p>
                <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                <p><strong>Console Output:</strong> <a href="${env.BUILD_URL}console">View Console</a></p>
                <p><strong>Error:</strong> Check console output for failure details</p>
                """,
                to: 'fakhareiqbal3534@gmail.com', // Change this to your real email
                mimeType: 'text/html'
            )
        }
        
        always {
            echo 'Pipeline completed'
            
            // Publish HTML reports if they exist
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: '.',
                reportFiles: 'selenium-test-report.html',
                reportName: 'Selenium Test Report'
            ])
            
            // Cleanup
            script {
                sh '''
                    # Keep only the latest 3 Docker images
                    docker images -q react-app | head -n -3 | xargs -r docker rmi || true
                    
                    # Clean up virtual environment
                    rm -rf selenium-env || true
                '''
            }
        }
        
        cleanup {
            // Only stop container if pipeline failed, otherwise keep it running
            script {
                if (currentBuild.result == 'FAILURE') {
                    sh '''
                        docker stop react-app-container || true
                        docker rm react-app-container || true
                    '''
                }
            }
        }
    }
}