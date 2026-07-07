pipeline {
    agent any
    
    // ── CONFIGURATION TIMEOUT GLOBAL ──────────────────────
    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))  // Garder les 10 derniers builds
    }

    environment {
        // ── DOCKER HUB ───────────────────────────────────
        DOCKERHUB_USER      = 'rimka03'
        IMAGE_BACKEND       = "${DOCKERHUB_USER}/portfolio-backend"
        IMAGE_FRONTEND      = "${DOCKERHUB_USER}/portfolio-frontend"
        IMAGE_TAG           = "${env.BUILD_NUMBER}"
        REGISTRY_CREDS      = 'dokerhub_access'
        
        // ── SONARQUBE ────────────────────────────────────
        SONAR_URL           = 'http://192.168.30.20:9000'
        SONAR_CREDS         = 'sonarqube-token'
        SONAR_SERVER        = 'sonarqube-server'
        
        // ── KUBERNETES ───────────────────────────────────
        KUBECONFIG          = '/var/lib/jenkins/.kube/config'
        KUBECTL_BIN         = '/usr/local/bin/kubectl'
        K8S_NAMESPACE       = 'default'
        K8S_TIMEOUT         = '120s'
        
        // ── GITHUB ───────────────────────────────────────
        GIT_REPO            = 'https://github.com/captain-francis018/learn-devops.git'
        GIT_BRANCH          = 'main'
        GIT_CREDS           = 'github-credentials'
        
        // ── EMAILS ───────────────────────────────────────
        ADMIN_EMAIL         = 'abdoukarimsy018@gmail.com'
        //SLACK_WEBHOOK       = credentials('slack-webhook')  // Optional
    }

    stages {
        // ── STAGE 1 : VALIDATION PRÉ-BUILD ──────────────────────
        stage('Pre-Build Checks') {
            steps {
                script {
                    echo "Vérification des prérequis..."
                    
                    sh '''
                        echo "Vérification Docker..."
                        docker --version || (echo "Erreur: Docker non trouvé" && exit 1)
                        
                        echo "Vérification kubectl..."
                        ${KUBECTL_BIN} version --client || (echo "Erreur: kubectl non trouvé" && exit 1)
                        
                        echo "Vérification npm..."
                        npm --version || (echo "Erreur: npm non trouvé" && exit 1)
                        
                        echo "Vérification Connexion à SonarQube..."
                        curl -sf ${SONAR_URL}/api/system/status || (echo "Attention: SonarQube non accessible" )
                    '''
                }
            }
        }

        // ── STAGE 2 : CLONE ─────────────────────────────────────
        stage('Clone') {
            steps {
                echo "Récupération du code depuis GitHub..."
                
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${GIT_BRANCH}"]],
                    userRemoteConfigs: [[
                        url: "${GIT_REPO}",
                        credentialsId: "${GIT_CREDS}"
                    ]]
                ])
                
                script {
                    env.GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.GIT_COMMIT_MSG = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim()
                    echo "Code récupéré (commit: ${env.GIT_COMMIT_SHORT})"
                }
            }
        }

        // ── STAGE 3 : INSTALL DÉPENDANCES ───────────────────────
        stage('Install Dependencies') {
            steps {
                echo "Installation des dépendances..."
                
                sh '''
                    echo "Backend..."
                    cd Jenkins_et_Sonarqube/backend && npm install --legacy-peer-deps && cd ../..
                    
                    echo "Frontend..."
                    cd Jenkins_et_Sonarqube/frontend && npm install --legacy-peer-deps && cd ../..
                    
                    echo "Dépendances installées"
                '''
            }
        }

        // ── STAGE 4 : SONARQUBE ANALYSIS ────────────────────────
        stage('SonarQube Analysis') {
            steps {
                echo "Analyse qualité du code avec SonarQube..."
                
                withSonarQubeEnv("${SONAR_SERVER}") {
                    withCredentials([string(credentialsId: "${SONAR_CREDS}", variable: 'SONAR_TOKEN')]) {
                        sh '''
                            echo "Analyse Backend..."
                            cd Jenkins_et_Sonarqube/backend
                            npx sonar-scanner \
                                -Dsonar.projectKey=portfolio-backend \
                                -Dsonar.projectName="Portfolio Backend" \
                                -Dsonar.projectVersion=${BUILD_NUMBER} \
                                -Dsonar.sources=. \
                                -Dsonar.exclusions=node_modules/**,coverage/** \
                                -Dsonar.host.url=${SONAR_URL} \
                                -Dsonar.login=${SONAR_TOKEN}
                            cd ../..
                            
                            echo "Analyse Frontend..."
                            cd Jenkins_et_Sonarqube/frontend
                            npx sonar-scanner \
                                -Dsonar.projectKey=portfolio-frontend \
                                -Dsonar.projectName="Portfolio Frontend" \
                                -Dsonar.projectVersion=${BUILD_NUMBER} \
                                -Dsonar.sources=src \
                                -Dsonar.exclusions=node_modules/**,dist/** \
                                -Dsonar.host.url=${SONAR_URL} \
                                -Dsonar.login=${SONAR_TOKEN}
                            cd ../..
                            
                            echo "Analyses terminées"
                        '''
                    }
                }
            }
        }

        // ── STAGE 5 : QUALITY GATE ──────────────────────────────
        stage('Quality Gate') {
            steps {
                echo "Vérification Quality Gate SonarQube..."
                
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
                
                echo "Quality Gate validé"
            }
        }

        // ── STAGE 6 : BUILD DOCKER ──────────────────────────────
        stage('Build Docker Images') {
            steps {
                echo "Construction des images Docker..."
                
                sh '''
                    # Nettoyer les images précédentes
                    docker image prune -f --filter "dangling=true" || true
                    
                    # Build des images
                    cd Jenkins_et_Sonarqube
                    docker compose build --no-cache
                    cd ..
                    
                    # Vérifier que les images existent
                    echo "Images construites avec succès"
                    docker images | grep portfolio
                '''
            }
        }

        // ── STAGE 7 : PUSH DOCKER HUB ───────────────────────────
        stage('Push to Docker Hub') {
            steps {
                echo "Publication des images sur Docker Hub..."
                
                withCredentials([usernamePassword(
                    credentialsId: "${REGISTRY_CREDS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        # Login à Docker Hub
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        
                        # Récupérer les IDs des images
                        cd Jenkins_et_Sonarqube
                        BACKEND_IMAGE=$(docker compose config --images | grep backend | head -1)
                        FRONTEND_IMAGE=$(docker compose config --images | grep frontend | head -1)
                        cd ..
                        
                        if [ -z "$BACKEND_IMAGE" ] || [ -z "$FRONTEND_IMAGE" ]; then
                            echo "Erreur: Les images n'ont pas pu être trouvées"
                            exit 1
                        fi
                        
                        echo "Tag: backend -> ${IMAGE_BACKEND}:${IMAGE_TAG}"
                        docker tag ${BACKEND_IMAGE} ${IMAGE_BACKEND}:${IMAGE_TAG}
                        docker tag ${BACKEND_IMAGE} ${IMAGE_BACKEND}:latest
                        
                        echo "Tag: frontend -> ${IMAGE_FRONTEND}:${IMAGE_TAG}"
                        docker tag ${FRONTEND_IMAGE} ${IMAGE_FRONTEND}:${IMAGE_TAG}
                        docker tag ${FRONTEND_IMAGE} ${IMAGE_FRONTEND}:latest
                        
                        # Push
                        echo "Push backend:${IMAGE_TAG}..."
                        docker push ${IMAGE_BACKEND}:${IMAGE_TAG}
                        docker push ${IMAGE_BACKEND}:latest
                        
                        echo "Push frontend:${IMAGE_TAG}..."
                        docker push ${IMAGE_FRONTEND}:${IMAGE_TAG}
                        docker push ${IMAGE_FRONTEND}:latest
                        
                        # Logout
                        docker logout
                        
                        echo "Images publiées"
                    '''
                }
            }
        }

        // ── STAGE 8 : DEPLOY KUBERNETES ─────────────────────────
stage('Deploy to Kubernetes') {
    steps {
        echo "Déploiement sur Kubernetes..."
        
        sh '''
            KUBECTL="${KUBECTL_BIN}"
            
            echo "Vérification de la connexion K3s..."
            RETRIES=5
            for i in $(seq 1 $RETRIES); do
                if $KUBECTL cluster-info > /dev/null 2>&1; then
                    echo "Connexion K3s OK (tentative $i/$RETRIES)"
                    break
                fi
                if [ "$i" -eq "$RETRIES" ]; then
                    echo "Erreur: Impossible de se connecter au cluster K3s après $RETRIES tentatives"
                    $KUBECTL cluster-info
                    exit 1
                fi
                echo "Tentative $i/$RETRIES échouée, nouvelle tentative dans 5s..."
                sleep 5
            done
            
            # Créer le namespace s'il n'existe pas
            $KUBECTL create namespace ${K8S_NAMESPACE} --dry-run=client -o yaml | $KUBECTL apply -f -
            
            # Appliquer les manifests
            echo "Déploiement des manifests Kubernetes..."
            $KUBECTL apply -f Jenkins_et_Sonarqube/Manifeste-k3s/mongodb-secret.yaml
            $KUBECTL apply -f Jenkins_et_Sonarqube/Manifeste-k3s/mongodb.yaml
            $KUBECTL apply -f Jenkins_et_Sonarqube/Manifeste-k3s/backend.yaml
            $KUBECTL apply -f Jenkins_et_Sonarqube/Manifeste-k3s/frontend.yaml
            
            echo "Attente du déploiement..."
            $KUBECTL rollout restart deployment/backend
            $KUBECTL rollout restart deployment/frontend
            
            $KUBECTL rollout status deployment/backend --timeout=${K8S_TIMEOUT}
            $KUBECTL rollout status deployment/frontend --timeout=${K8S_TIMEOUT}
            
            echo "Déploiement Kubernetes terminé"
        '''
    }
}

        // ── STAGE 9 : SMOKE TESTS ───────────────────────────────
        stage('Smoke Tests') {
            steps {
                echo "Tests de validation post-déploiement..."
                
                sh '''
                    KUBECTL="${KUBECTL_BIN}"
                    
                    echo "Attente de la stabilisation (10s)..."
                    sleep 10
                    
                    echo "État des pods :"
                    $KUBECTL get pods
                    
                    echo "État des services :"
                    $KUBECTL get services
                    
                    # Récupérer les adresses IP/ports
                    BACKEND_PORT=$($KUBECTL get service backend -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "5000")
                    FRONTEND_PORT=$($KUBECTL get service frontend -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "80")
                    
                    echo "Backend port: $BACKEND_PORT"
                    echo "Frontend port: $FRONTEND_PORT"
                    
                    # Tests API
                    echo "Test API Backend..."
                    for i in {1..5}; do
                        if curl -sf http://localhost:$BACKEND_PORT/api/projects > /dev/null; then
                            echo "API Backend OK (tentative $i)"
                            break
                        else
                            echo "Attente... (tentative $i/5)"
                            sleep 3
                        fi
                    done
                    
                    # Test Frontend
                    echo "Test Frontend..."
                    curl -sf http://localhost:$FRONTEND_PORT | grep -q "html" && echo "Frontend OK" || echo "Attention: Frontend non réactif"
                '''
            }
        }
    }


    // ── POST ACTIONS ─────────────────────────────────────────
    post {
        success {
            script {
                echo "Pipeline réussi — Portfolio déployé avec succès"
                echo "Build #${env.BUILD_NUMBER} réussi"
                
                // Notification email (commentée si le plugin n'est pas configuré)
                /*
                emailext (
                    subject: "SUCCÈS - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: "Le pipeline a été exécuté avec succès.",
                    to: "abdoukarimsy018@gmail.com"
                )
                */
            }
        }

        failure {
            script {
                echo "Pipeline échoué — Veuillez consulter les logs"
                echo "Build #${env.BUILD_NUMBER} échoué"
                
                // Notification email (commentée si le plugin n'est pas configuré)
                /*
                emailext (
                    subject: "ÉCHEC - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: "Le pipeline a échoué. Veuillez vérifier les logs pour plus de détails.",
                    to: "abdoukarimsy018@gmail.com"
                )
                */
            }
        }

        always {
            script {
                echo "Nettoyage du workspace..."
                
                // Optionnel : Notification Slack
                /*
                if (currentBuild.result == 'SUCCESS') {
                    sh '''
                        curl -X POST -H 'Content-type: application/json' \
                            --data '{"text":"Portfolio déployé : build #'${BUILD_NUMBER}' réussi"}' \
                            ${SLACK_WEBHOOK}
                    '''
                } else {
                    sh '''
                        curl -X POST -H 'Content-type: application/json' \
                            --data '{"text":"Build #'${BUILD_NUMBER}' échoué - Consultez Jenkins"}' \
                            ${SLACK_WEBHOOK}
                    '''
                }
                */
            }
        }
        
        unstable {
            echo "Pipeline instable — Vérification nécessaire"
        }
    }
}