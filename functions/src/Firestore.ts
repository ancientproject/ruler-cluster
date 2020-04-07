import { initializeApp, firestore } from "firebase-admin";
import { config } from "firebase-functions";

export function init() 
{
    initializeApp(config().firebase);
}
export function getDB() : FirebaseFirestore.Firestore
{
    return firestore();
}