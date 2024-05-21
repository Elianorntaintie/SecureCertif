<template>
    <div class="all">
        <div class="container">
            <div class="head">
                <router-link to="/mesVehicules"><i style="margin-top: 15px; color: #06283dc9;" class="fas fa-chevron-left"></i></router-link>
                <h2 class="monda-font">Modifier votre compte</h2>
                <p class="stext monda-font">mettre a jour les informations de connexion</p>
            </div>

            <form @submit.prevent="updateAccount">
                <i style="color: rgba(51, 167, 226, 1); margin: auto; font-size: 45px;" class="fa fa-user"></i>
                <div class="input-field">
                    <label for="name">Nom</label>
                    <input type="text" id="name" v-model="name" required>
                </div>
                <div class="input-field">
                    <label for="telephone">Telephone/Email</label>
                    <input id="contact" v-model="contact" required>
                </div>
                <div class="input-field">
                    <label for="oldPassword">Ancien mot de passe</label>
                    <input type="password" id="oldPassword" v-model="oldPassword" required>
                </div>
                <div class="input-field">
                    <label for="password">Nouveau Mot de passe</label>
                    <input type="password" id="password" v-model="password" required>
                </div>
                <button class="btn" type="submit" :disabled="loading">
                    <span class="loading-indicator" v-if="loading"></span>
                    <span>Modifier le compte</span>
                </button>
            </form>
        </div>
    </div>
</template>
  
<script>
import { hashSync, compareSync } from 'bcryptjs';
import { firestore } from '@/config/firebaseConfig';
import { TABLE } from '@/config/constantes/tables.js';
import { updateDoc, doc, getDoc } from 'firebase/firestore';

export default {
    components: {
    },
    data() {
        return {
            name: '',
            contact: '',
            password: '',
            oldPassword: '',
            loading: false,
            currentUserID: null,
            oldHashedPassword: ''
        };
    },
    created() {

        this.currentUserID = this.$route.params.userId;
        this.getOldHashedPassword();
    },

    methods: {
        async getOldHashedPassword() {
            try {
                const userDocRef = doc(firestore, TABLE.USER, this.currentUserID);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    this.oldHashedPassword = userData.password;
                } else {
                    console.error('Utilisateur non trouvé');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'ancien mot de passe:', error);
            }
        },
        updateAccount() {
            this.loading = true;
            // Vérification de l'ancien mot de passe
            const oldPasswordMatch = compareSync(this.oldPassword, this.oldHashedPassword);
            if (!oldPasswordMatch) {
                console.error("L'ancien mot de passe saisi est incorrect");
                this.loading = false;
                return;
            }
            // Hashage du nouveau mot de passe
            const saltRounds = 10;
            const hashedPassword = hashSync(this.password, saltRounds);

            const updatedUser = {
                name: this.name,
                contact: this.contact,
                password: hashedPassword                                                                       
            };                                                       

            if (this.currentUserID) {
                updateDoc(doc(firestore, TABLE.USER, this.currentUserID), updatedUser)
                    .then(() => {
                        console.log('Compte mis à jour avec succès');
                        this.$router.push("/auth");
                        // Effectuez les actions nécessaires ici
                    })
                    .catch((error) => {
                        console.error('Erreur lors de la mise à jour du compte:', error);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                console.error('ID utilisateur actuel manquant');
                this.loading = false;
            }
        },
    },
};
</script>
<style scoped>
body {
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.05);
    font-family: Monda;
}

.head {
    margin: auto;
    width: 100%;
}

.all {
    background-color: rgba(0, 0, 0, 0.05);
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex !important;
    font-family: Monda;
}

.container {
    width: 40%;
    margin-left: 5%;
    background-color: white;
    padding: 20px;
    height: 94.6vh;
    overflow-y: auto;
    font-family: Monda;
}

h2 {
    color: #06283D;
}

p {
    color: rgba(0, 0, 0, 0.2);
    font-size: 12px;
    margin-top: -23px;
}

form {
    width: 100%;
    margin: auto;
    margin-top: 50px;
}

.input-field {
    margin-top: 20px;
    display: block;
    width: 100%;
}

input {
    width: 97%;
    height: 35px;
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 50px;
    padding-left: 3%;
    margin-top: 5px;
}

label {
    width: 50% !important;
    text-align: left;
    padding-right: 2%;
    color: #06283D;
}

.btn {
    margin-top: 20px;
    font-size: 17px;
    background: rgba(51, 167, 226, 1);
    border: none;
    width: 100%;
    border-radius: 50px;
    height: 35px;
    color: white;
    transition: all 0.3s
}

.btn:hover {
    background-color: transparent;
    color: rgba(51, 167, 226, 1);
    border: 1px solid rgba(51, 167, 226, 1);
}
</style>