/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
'use server';
import { storage } from '@ai/storage-client';
import * as path from 'path';

/**
 * Liste tous les buckets
 */
export async function listBuckets() {
    try {
        const [buckets] = await storage.getBuckets();
        console.log('Liste des buckets:');
        buckets.forEach((bucket) => {
            console.log(bucket.name);
        });
        return buckets;
    } catch (error) {
        console.error('Erreur lors de la récupération des buckets:', error);
        throw error;
    }
}

/**
 * Liste tous les fichiers dans un bucket
 * @param bucketName Nom du bucket
 */
export async function listFiles(bucketName: string) {
    try {
        const [files] = await storage.bucket(bucketName).getFiles();
        console.log(`Fichiers dans le bucket ${bucketName}:`);
        files.forEach((file) => {
            console.log(file.name);
        });
        return files;
    } catch (error) {
        console.error(`Erreur lors de la récupération des fichiers du bucket ${bucketName}:`, error);
        throw error;
    }
}

/**
 * Télécharge un fichier depuis Google Cloud Storage
 * @param bucketName Nom du bucket
 * @param fileName Nom du fichier dans le bucket
 * @param destination Chemin de destination local
 */
export async function downloadFile(bucketName: string, fileName: string, destination: string) {
    try {
        const options = {
            destination: destination,
        };

        await storage.bucket(bucketName).file(fileName).download(options);
        console.log(`Fichier ${fileName} téléchargé avec succès vers ${destination}`);
        return true;
    } catch (error) {
        console.error(`Erreur lors du téléchargement du fichier ${fileName}:`, error);
        throw error;
    }
}

/**
 * Téléverse un fichier vers Google Cloud Storage
 * @param bucketName Nom du bucket
 * @param filePath Chemin du fichier local à téléverser
 * @param destinationFileName Nom du fichier dans GCS (optionnel)
 */
export async function uploadFile(bucketName: string, filePath: string, destinationFileName?: string) {
    try {
        const fileName = destinationFileName || path.basename(filePath);
        const options = {
            destination: fileName,
            // Vous pouvez spécifier des métadonnées personnalisées ici
            metadata: {
                contentType: determineContentType(filePath),
            },
        };

        await storage.bucket(bucketName).upload(filePath, options);
        console.log(`Fichier ${filePath} téléversé avec succès vers ${bucketName}/${fileName}`);
        return true;
    } catch (error) {
        console.error(`Erreur lors du téléversement du fichier ${filePath}:`, error);
        throw error;
    }
}

/**
 * Supprime un fichier de Google Cloud Storage
 * @param bucketName Nom du bucket
 * @param fileName Nom du fichier à supprimer
 */
export async function deleteFile(bucketName: string, fileName: string) {
    try {
        await storage.bucket(bucketName).file(fileName).delete();
        console.log(`Fichier ${fileName} supprimé avec succès`);
        return true;
    } catch (error) {
        console.error(`Erreur lors de la suppression du fichier ${fileName}:`, error);
        throw error;
    }
}

/**
 * Génère une URL signée pour un accès limité dans le temps
 * @param bucketName Nom du bucket
 * @param fileName Nom du fichier
 * @param expiresInMinutes Durée de validité de l'URL en minutes
 */
export async function generateSignedUrl(bucketName: string, fileName: string, expiresInMinutes: number = 15) {
    try {
        const options = {
            version: 'v4' as const,
            action: 'read' as const,
            expires: Date.now() + expiresInMinutes * 60 * 1000,
        };

        const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
        console.log(`URL signée générée pour ${fileName}: ${url}`);
        return url;
    } catch (error) {
        console.error(`Erreur lors de la génération de l'URL signée pour ${fileName}:`, error);
        throw error;
    }
}

/**
 * Détermine le type de contenu basé sur l'extension du fichier
 * @param filePath Chemin du fichier
 */
function determineContentType(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase();
    const contentTypes: { [key: string]: string } = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    return contentTypes[extension] || 'application/octet-stream';
}
