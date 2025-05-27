// pipeline {
//     agent any

//     environment {
//         IMAGE_NAME = 'johnstx/bluerise'
//         IMAGE_TAG = 'v1.1'
//         REGISTRY_CREDENTIALS_ID = 'dockerhub-login'  // Jenkins credentials ID
//     }

//     stages {


//         stage('Clean Workspace') {
//           steps {
//                     cleanWs() // Cleans the workspace before running the pipeline
//           }
//         }

//         stage('Checkout') {
//             steps {
//                 checkout scm
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
//                 }
//             }
//         }

//         stage('Login to Docker Registry') {
//             steps {
//                 script {
//                     withCredentials([usernamePassword(credentialsId: "${REGISTRY_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
//                         sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
//                     }
//                 }
//             }
//         }

//         stage('Push Image') {
//             steps {
//                 script {
//                     sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             sh 'docker logout'
//         }
//     }
// }


pipeline {
    agent any

    environment {
        REGISTRY_CREDENTIALS_ID = 'dockerhub-login'  // Jenkins credentials ID
        IMAGE_NAME = 'johnstx/bluerise'
        SONARQUBE_ENV = 'SonarQubeServer' // Jenkins SonarQube server name
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        // stage('Code Quality Analysis') {
        //     steps {
        //         withSonarQubeEnv("${SONARQUBE_ENV}") {
        //             sh 'sonar-scanner'
        //         }
        //     }
        // }



        stage('Docker Build') {
            steps {
                script {
                    def imageTag = "v${env.BUILD_NUMBER}"
                    sh "docker build -t ${IMAGE_NAME}:${imageTag} ."
                    sh "docker tag ${IMAGE_NAME}:${imageTag} ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    def imageTag = "v${env.BUILD_NUMBER}"
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${IMAGE_NAME}:${imageTag}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                sh './deploy-staging.sh'
            }
        }

        stage('Approval & Deploy to Production') {
            steps {
                input message: 'Approve Production Deployment?'
                sh './deploy-prod.sh'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully."
        }
        failure {
            mail to: 'rxstaxx.io@gmail.com',
                 subject: "❌ Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Build URL: ${env.BUILD_URL}"
        }
    }
}
