import React, { useEffect, useState } from 'react';
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import IconButton from '@mui/material/IconButton';
import DescriptionIcon from '@mui/icons-material/Description';
import logo from '../logo.svg';

// Maps for labels
const TYPE_BIEN_MAP = { H: 'Habitation', NH: 'Hors habitation' };
const GARANTIE_MAP = { DO: 'DO seule', TRC: 'TRC seule', DUO: 'Duo (DO + TRC)' };

export default function GenerateDevisDOCX({ devis }) {
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const now = new Date();
  const datePart = now.toISOString().split('T')[0];           // "2025-05-28"
  const timePart = now.toTimeString().substring(0, 5);        // "12:29"

  // Utilisez un tiret (ou point) au lieu du deux-points
  const filename = `Proposition_commerciale_${devis.numero_opportunite}_${datePart}-${timePart}.docx`;

  // ce n'est possible de Construction du nom de fichier avec des “:”

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

  const generateDOCX = async () => {
    const children = [];

    // Sidebar content (as separate paragraphs)
    const sidebarLines = [
      'NOUS CONTACTER',
      'VOTRE AGENT GÉNÉRAL',
      "D'ASSURANCE EXCLUSIF",
      'AXA FRANCE',
      'EI HUON HELENE',
      '3 RUE DES HALLES BP 40019',
      '72120 ST CALAIS',
      '02 43 35 03 00',
      'agence.helenehuon@axa.fr',
      'N° ORIAS 22006858',
      'orias.fr',
    ];
    sidebarLines.forEach((line, idx) => {
      children.push(new Paragraph({
        text: line,
        style: 'sidebar',
      }));
    });

    // Logo centered
    if (logoDataUrl) {
      children.push(
        new Paragraph({
          children: [
            new ImageRun({ data: logoDataUrl.split(',')[1], transformation: { width: 50, height: 50 } })
          ],
          alignment: AlignmentType.CENTER,
        })
      );
    }

    // Header right
    children.push(
      new Paragraph({
        text: 'Assurance et Banque',
        style: 'headerBold',
        alignment: AlignmentType.RIGHT,
      })
    );

    // References block
    const refs = [
      `LE ${(devis.created_at).split('T')[0].split('-').reverse().join('/')} `,
      `Votre devis ${devis.id}`,
      `Votre référence Client ${devis.id}`,
      `Emis ${(devis.created_at).split('T')[0]}`,
      `Valide jusqu’au 17/04/2026`,
    ];
    refs.forEach(line => {
      children.push(new Paragraph({ text: line, style: 'ref' }));
    });

    // Title and intro
    children.push(new Paragraph({ text: "VOTRE DEVIS D'ASSURANCE", style: 'title' }));
    children.push(new Paragraph({ text: 'Ma Protection Accident', style: 'subtitle' }));
    children.push(new Paragraph({ text: `Cher Monsieur ${devis.user}`, style: 'normal' }));
    children.push(new Paragraph({ text: 'Nous vous remercions de nous avoir consulté pour votre assurance Ma Protection Accident.', style: 'normal' }));

    // Table of details
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [
          new TableCell({ children: [new Paragraph({ text: 'Champs', style: 'tableHeader' })], borders: {} }),
          new TableCell({ children: [new Paragraph({ text: 'Valeur', style: 'tableHeader' })], borders: {} }),
        ]}),
        ...[
          ['Type de bien', TYPE_BIEN_MAP[devis.type_de_bien]],
          ['Garantie', GARANTIE_MAP[devis.type_de_garantie]],
          ['Tarif (€)', parseFloat(devis.tarif).toFixed(2)],
          ['Prime totale (€)', parseFloat(devis.prime_totale).toFixed(2)],
        ].map(([label, value]) =>
          new TableRow({ children: [
            new TableCell({ children: [new Paragraph(label)], borders: {} }),
            new TableCell({ children: [new Paragraph(value)], borders: {} }),
          ]})
        ),
      ],
    });
    children.push(table);

    // Footer
    children.push(new Paragraph({ text: "AXA France Vie - S A au capital de 487 725 073,50€ - RCS Nanterre 310 499 959 - TVA intracommunautaire nº FR 62 310 499 959 - AXA Assurances Vie Mutuelle - Société d'assurance mutuelle sur la vie et de capitalisation à cotisations fixes - Siren 353 457 245 - TVA intracommunautaire nº FR 48 353 457 245 - Sièges sociaux : 313 Terrasses de l'Arche - 92727 Nanterre Cedex. Entreprises régies par le code des assurances - Inter partner assistance - S A. De droit belge au capital de 130 702 614€ - Siège social : 7 boulevard du Régent - 1000 Bruxelles. Entreprise d'assurance agréée par la Banque Nationale de Belgique sous le nº de code 0457 immatriculée au registre des Personnes Morales de Bruxelles sous le nº BCE : 0415.591.055 prise au travers de la succursale française (316 139 500 RCS Nanterre) établie 6 rue André Gide - 92320 Châtillon ", style: 'footer' }));
    children.push(new Paragraph({ text: '1/1', style: 'footerRight', alignment: AlignmentType.RIGHT }));

    const doc = new Document({
      styles: {
        paragraphStyles: [
          { id: 'sidebar', run: { font: 'Arial', size: 18, bold: false }, paragraph: { spacing: { after: 120 } } },
          { id: 'headerBold', run: { font: 'Arial', size: 22, bold: true } },
          { id: 'ref', run: { font: 'Arial', size: 20 } },
          { id: 'title', run: { font: 'Arial', size: 36, bold: true, color: '0C1C84' } },
          { id: 'subtitle', run: { font: 'Arial', size: 24 } },
          { id: 'normal', run: { font: 'Arial', size: 20 } },
          { id: 'tableHeader', run: { font: 'Arial', size: 20, bold: true, color: '1E90FF' } },
          { id: 'footer', run: { font: 'Arial', size: 14 } },
          { id: 'footerRight', run: { font: 'Arial', size: 14 } },
        ],
      },
      sections: [{ children }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  };

  return (
    <IconButton onClick={generateDOCX} title="Générer le DOCX">
      <DescriptionIcon color="primary" />
    </IconButton>
  );
}