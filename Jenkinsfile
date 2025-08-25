pipeline {
    agent any
    tools {
        nodejs 'NodeJS_20'
    }

    environment {
        DOCKER_IMAGE = "rukevweubio/nodejs-app"
        DOCKER_TAG   = "latest"
        PATH = "$HOME/bin:$PATH"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Node.js App') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        echo "Testing the Node.js application..."
                        sh 'node -v'
                        sh 'npm -v'
                        sh 'npm install'
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Pushing image to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push $DOCKER_IMAGE:$DOCKER_TAG"
                    }
                }
            }
        }

        stage('Install Kind') {
            steps {
                script {
                    sh '''
                        mkdir -p $HOME/bin
                        curl -Lo $HOME/bin/kind https://kind.sigs.k8s.io/dl/v0.25.0/kind-linux-amd64
                        chmod +x $HOME/bin/kind
                        export PATH=$HOME/bin:$PATH
                        kind version
                    '''
                }
            }
        }

        stage('Create Kind Cluster') {
            steps {
                script {
                    sh '''
                        export PATH=$HOME/bin:$PATH
                        kind delete cluster --name jenkins-demo
                        kind create cluster --name jenkins-demo
                        kubectl cluster-info --context kind-jenkins-demo
                    '''
                }
            }
        }

        stage('Load Docker Image into Kind') {
            steps {
                script {
                    sh '''
                        export PATH=$HOME/bin:$PATH
                        kind load docker-image $DOCKER_IMAGE:$DOCKER_TAG --name jenkins-demo
                    '''
                }
            }
        }

        stage('Deploy to Kind') {
            steps {
                script {
                    sh '''
                        export PATH=$HOME/bin:$PATH
                        kubectl apply -f k8/deployment.yaml
                        kubectl apply -f k8/service.yaml
                        kubectl rollout status deployment/nodejs-app
                        kubectl get pods
                    '''
                }
            }
        }

        stage('Pause for Inspection') {
            steps {
                echo "Pausing for 5 minutes so you can inspect pods..."
                sh 'sleep 300'  // 5 minutes pause
            }
        }
    }

    post {
        always {
            echo "Optionally delete the Kind cluster manually after inspection."
        }
    }
}
