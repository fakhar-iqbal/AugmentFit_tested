pipeline {
    agent any
    
    environment {
        REPO_URL = 'https://github.com/yourusername/your-repo.git'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Test Environment') {
            steps {
                script {
                    // Build Docker image for tests
                    sh 'docker build -f Dockerfile.tests -t selenium-tests .'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    // Run tests in Docker container
                    sh '''
                        docker run --rm \
                        -v $(pwd)/selenium-tests/reports:/app/reports \
                        selenium-tests
                    '''
                }
            }
            post {
                always {
                    // Archive test results
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'selenium-tests/reports',
                        reportFiles: 'test_report.html',
                        reportName: 'Selenium Test Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            // Email test results
            emailext(
                to: '${CHANGE_AUTHOR_EMAIL}',
                subject: 'Test Results: ${JOB_NAME} - Build ${BUILD_NUMBER}',
                body: '''
                Build: ${BUILD_NUMBER}
                Status: ${BUILD_STATUS}
                
                Test Results: ${BUILD_URL}Selenium_Test_Report/
                
                Console Output: ${BUILD_URL}console
                ''',
                attachmentsPattern: 'selenium-tests/reports/*.html'
            )
        }
    }
}