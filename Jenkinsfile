pipeline {
    agent any

    environment {
        IMAGE_NAME = 'johnstx/bluerise'
        IMAGE_TAG = 'v1.1'
        REGISTRY_CREDENTIALS_ID = 'dockerhub-login'  // Jenkins credentials ID
    }

    stages {


        stage('Clean Workspace') {
          steps {
                    cleanWs() // Cleans the workspace before running the pipeline
          }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Login to Docker Registry') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${REGISTRY_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    }
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}
