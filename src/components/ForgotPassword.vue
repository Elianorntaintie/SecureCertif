<template>
    <div id="app">
        <form v-if="showSubmitForm" @submit.prevent="submitForm">
            <div v-if="!showSubmitName">
                <label for="contact">Adresse e-mail ou numéro de téléphone :</label>
                <input type="text" id="contact" v-model="contact" required>
            </div>
            <div v-if="showSubmitName">
                <label for="name">Nom :</label>
                <input type="text" id="name" v-model="name" required>
            </div>
            <div v-if="showPasswordForm">
                <label for="newPassword">Nouveau mot de passe :</label>
                <input type="password" id="newPassword" v-model="newPassword" required>
            </div>
            <button type="submit">{{ submitButtonText }}</button>
        </form>
        <div v-if="loading">Chargement en cours...</div>
    </div>
</template>

<script>
import { TABLE } from '@/config/constantes/tables';
import { firestore } from '@/config/firebaseConfig';
import { getDocs, collection, query, where, updateDoc, doc } from 'firebase/firestore';

export default {
    data() {
        return {
            contact: '',
            name: '',
            newPassword: localStorage.getItem('newPassword') || '12345678',
            loading: false,
            showSubmitForm: true,
            showSubmitName: false,
            showPasswordForm: false,
            submitButtonText: "Vérifier E-mail/Telephone",
        };
    },
    methods: {
        async submitForm() {
            this.loading = true;
            if (!this.showSubmitName) {
                // Vérifier si l'adresse e-mail ou le numéro de téléphone existe dans Firebase
                const usersRef = collection(firestore, TABLE.USER);
                const q = query(usersRef, where('contact', '==', this.contact));
                try {
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        // L'utilisateur existe, afficher le formulaire pour le nom
                        this.showSubmitForm = true;
                        this.showSubmitName = true;
                        this.submitButtonText = "Vérifier votre Nom";
                    } else {
                        // L'utilisateur n'existe pas, afficher un message d'erreur ou rediriger vers une page d'erreur
                        console.error("L'utilisateur n'existe pas");
                    }
                } catch (error) {
                    console.error("Erreur lors de la vérification de l'utilisateur :", error);
                }
            } else {
                // Vérifier si le nom correspond à l'utilisateur
                const usersRef = collection(firestore, TABLE.USER);
                const q = query(usersRef, where('contact', '==', this.contact), where('name', '==', this.name));
                try {
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        // L'utilisateur existe, afficher le formulaire pour le nouveau mot de passe
                        this.showSubmitForm = true;
                        this.showSubmitName = true;
                        this.showPasswordForm = true;
                        this.submitButtonText = "Réinitialiser le mot de passe";
                    } else {
                        // L'utilisateur n'existe pas, afficher un message d'erreur ou rediriger vers une page d'erreur
                        console.error("L'utilisateur n'existe pas");
                    }
                } catch (error) {
                    console.error("Erreur lors de la vérification de l'utilisateur :", error);
                }
            }
            this.loading = false;
        },

        async resetPassword() {
            this.loading = true;
            try {
                // Réinitialiser le mot de passe dans Firebase
                const usersRef = collection(firestore, TABLE.USER);
                const q = query(usersRef, where('contact', '==', this.contact), where('name', '==', this.name));
                const querySnapshot = await getDocs(q);
                console.log({ uesr: this.userId });

                if (!querySnapshot.empty) {
                    // L'utilisateur existe, récupérer le document de l'utilisateur
                    const userDoc = querySnapshot.docs[0];
                    const userId = userDoc.id;

                    // Mettre à jour le mot de passe de l'utilisateur dans le document Firestore
                    await updateDoc(doc(usersRef, userId), { password: this.newPassword });

                    console.log('Mot de passe réinitialisé avec succès');

                    // Enregistrer la nouvelle valeur de newPassword dans le localStorage
                    localStorage.setItem('newPassword', this.newPassword);
                } else {
                    // L'utilisateur n'existe pas, afficher un message d'erreur ou rediriger vers une page d'erreur
                    console.error("L'utilisateur n'existe pas");
                }
            } catch (error) {
                console.error("Erreur lors de la réinitialisation du mot de passe :", error);
            }
            this.loading = false;
        },
    },
};
</script>