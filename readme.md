```
# License

This project is licensed under the [MIT License](LICENSE).
```

### BlueRise weather updates
Built as a lightweight weather App.
Weather API from www.weatherAPI.com



Requirements


### Set up the work directory & Install core dependencies
1. Initialize the app
```bash
mkdir testapp && cd testapp
npm init -y
npm install express axios dotenv
```

#### Create the folder structure. 

```bash
mkdir public && cd public
touch index.html response.html
```

### 2. Create the .env file in **testapp** to store an API key from for the weather information.

```bash
WEATHER_API_KEY=your_actual_weather_api_key
```
(Replace your_actual_weather_api_key with your own from https://www.weatherapi.com)


### 3. Add HTML templates in /public folder.
index.html
response.html

### 4. Update the server (index.js)

### 5. Test the app
Run it locally.
```bash
node index.js
```
Check http://localhost:3000, enter a city, and see the live weather details returned in your custom HTML page.





*   Check index.js file for server code.
*   API key: Registered and was obtained from weatherapi.com. 
* Create a .env file and create assign the api key to a WEATHER_API_KEY variable.
WEATHER_API_KEY=weatherapi_key
 * Run node index.js and curl localhost against your chosen port.

 It turns out well when you can get weather results for any city entered.



### Dockerization of the node.js App

####  This makes the applcation reusable across various teams in the organisation without he hassle of setting up the dependencies and envirionments for the app. 

1. Create the Dockerfile

2. Build image
 ``` 
 $ docker build -t name_of_app .
 ``` 

**check image list**
 ```
 $ docker image ls
 ``` 
 
 3. Run the container with the image created.


###################
<!-- pipeline {
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

        stage('Code Quality Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

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
} -->
