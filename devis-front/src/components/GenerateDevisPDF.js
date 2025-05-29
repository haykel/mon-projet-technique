import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import IconButton from '@mui/material/IconButton';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import logo from '../logo.svg';
import { Style } from 'docx';

// Mappings pour afficher les labels au lieu des codes
const TYPE_BIEN_MAP = { H: 'Habitation', NH: 'Hors habitation' };
const GARANTIE_MAP = { DO: 'DO seule', TRC: 'TRC seule', DUO: 'Duo (DO + TRC)' };

/**
 * Composant PDF personnalisé
 * @param {object} props
 * @param {object} props.devis - l'objet devis contenant les données
 * @param {string} props.filename - nom de fichier optionnel
 * @returns {JSX.Element}
 */

export default function GenerateDevisPDF({ devis }) {
    const [logoDataUrl, setLogoDataUrl] = useState(null);
    const [logoRatio, setLogoRatio] = useState(1);
    const now = new Date();
    const datePart = now.toISOString().split('T')[0];           // "2025-05-28"
    const timePart = now.toTimeString().substring(0, 5);        // "12:29"

    // Utilisez un tiret (ou point) au lieu du deux-points
    const filename = `Proposition_commerciale_${devis.numero_opportunite}_${datePart}-${timePart}.pdf`;

    // ce n'est possible de Construction du nom de fichier avec des “:”


    // Charger et convertir le logo AXA en DataURL
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = logo;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            setLogoDataUrl(canvas.toDataURL('image/png'));
        };
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF({ unit: 'pt', format: 'A4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // -------- Sidebar gauche --------
        const sx = 40;
        let y = 40;
        doc.setLineWidth(0.5);
        doc.line(sx, y, sx + 150, y, Style.double);
        doc.setFontSize(10);
        doc.setTextColor('#0C1C84');
        doc.setFont('PublicoHeadline-Bold', 'bold');
        doc.text('NOUS CONTACTER', sx, y+12);
        y += 15;
        doc.setLineWidth(0.5);
        doc.line(sx, y, sx + 150, y);
        y += 15;
        doc.setFontSize(9);
        const sidebarLines = [
            'VOTRE AGENT GÉNÉRAL',
            "D'ASSURANCE EXCLUSIF",
            'AXA FRANCE',
            'EI HUON HELENE',
        ];
        sidebarLines.forEach(line => { doc.text(line, sx, y); y += 12; });
        doc.setFont('PublicoHeadline-Bold', 'normal');
        doc.setFontSize(8);
        const sidebarAddress = [
            '3 RUE DES HALLES BP 40019',
            '72120 ST CALAIS',
            '02 43 35 03 00',
        ];
        sidebarAddress.forEach(line => { doc.text(line, sx, y); y += 12; });
        doc.setFont('PublicoHeadline-Bold', ' bold');
        doc.setFontSize(9);
        const sidebarContact = [
            '02 43 35 03 00',
            'agence.helenehuon@axa.fr',
        ];
        sidebarContact.forEach(line => { doc.text(line, sx, y); y += 12; });
        doc.setFont('PublicoHeadline-Bold', 'normal');
        doc.setFontSize(8);
        const sidebarFooter = [
            'N° ORIAS 22006858',
            'orias.fr',
        ];
        sidebarFooter.forEach(line => { doc.text(line, sx, y); y += 12; });

        // -------- Logo centré --------
        if (logoDataUrl) {
            const lw = 80;
            const lh = lw * logoRatio;
            doc.addImage(logoDataUrl, 'PNG', (pageWidth - lw) / 2, 30, lw, lh);
        }

        // -------- Header droit --------
        doc.setFont('PublicoHeadline-Bold', 'bold');
        doc.setFontSize(12).setTextColor('#0C1C84');
        doc.text('Assurance et Banque', sx + 400, 40);

        // -------- Section références --------
        doc.setFontSize(9);
        doc.setTextColor('#0C1C84');
        const refX = sx;
        let ry = 250;
        doc.text('LE 16 MARS 2023', refX, ry);
        ry += 10;
        doc.setLineWidth(0.5);
        doc.line(refX, ry, refX + 150, ry);
        ry += 14;
        doc.setFontSize(9);
        const refs = [
            'Votre devis 21595549304',
            'Votre référence Client 3735025604',
        ];
        refs.forEach(line => { doc.text(line, refX, ry); ry += 12; });
        ry += 17;
        doc.setFontSize(9);
        const date_ref = [
            `Emis ${(devis.created_at).split('T')[0]}`,
            'Valide jusqu’au 17/04/2026',
        ];
        date_ref.forEach(line => { doc.text(line, refX, ry); ry += 12; });

        // -------- Titre principal --------
        doc.setFontSize(14);
        doc.setTextColor('#0C1C84');
        doc.text("VOTRE DEVIS D'ASSURANCE", sx + 200, 200);
        doc.setFontSize(10);
        doc.setTextColor('#000000');
        doc.text('Ma Protection Accident', sx + 200, 218);
        doc.setFontSize(9);
        doc.text(`Cher Monsieur ${devis.user}`, sx + 200, 240);
        doc.setFontSize(9);
        doc.text('Nous vous remercions de nous avoir consulté', sx + 200, 255);
        doc.setFontSize(9);
        const intro = 'pour votre assurance Ma Protection Accident.';
        doc.text(intro, sx + 200, 265, { maxWidth: pageWidth - sx - 80 });

        // Détails formatés
        const tableColumn = ['Champs', 'Valeur'];
        const tableRows = [
            ['Type de bien', TYPE_BIEN_MAP[devis.type_de_bien] || devis.type_de_bien],
            ['Garantie', GARANTIE_MAP[devis.type_de_garantie] || devis.type_de_garantie],
            ['Tarif (€)', parseFloat(devis.tarif).toFixed(2)],
            ['Prime totale (€)', parseFloat(devis.prime_totale).toFixed(2)],
        ];

        autoTable(doc, {
            startY: 280,
            head: [tableColumn],
            body: tableRows,
            margin: { left: sx + 200, right: (pageWidth - (sx + 200) - 200) },
            tableWidth: 300,
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [30, 144, 255] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        // -------- Footer --------
        const fy = pageHeight - 60;
        doc.setLineWidth(0.5);
        doc.line(sx, fy, pageWidth - 40, fy);
        doc.setFontSize(7);
        const footerText = "AXA France Vie - S A au capital de 487 725 073,50€ - RCS Nanterre 310 499 959 - TVA intracommunautaire nº FR 62 310 499 959 - AXA Assurances Vie Mutuelle - Société d'assurance mutuelle sur la vie et de capitalisation à cotisations fixes - Siren 353 457 245 - TVA intracommunautaire nº FR 48 353 457 245 - Sièges sociaux : 313 Terrasses de l'Arche - 92727 Nanterre Cedex. Entreprises régies par le code des assurances - Inter partner assistance - S A. De droit belge au capital de 130 702 614€ - Siège social : 7 boulevard du Régent - 1000 Bruxelles. Entreprise d'assurance agréée par la Banque Nationale de Belgique sous le nº de code 0457 immatriculée au registre des Personnes Morales de Bruxelles sous le nº BCE : 0415.591.055 prise au travers de la succursale française (316 139 500 RCS Nanterre) établie 6 rue André Gide - 92320 Châtillon ";
        doc.text(footerText, sx, fy + 12, { maxWidth: pageWidth - 80 });
        doc.text('1/1', pageWidth - 60, fy + 12);


        doc.save(filename);
    };

    return (
        <IconButton onClick={generatePDF} title="Télécharger le devis statique" size="large">
            <PictureAsPdfIcon color="error" fontSize="large" />
        </IconButton>
    );
}