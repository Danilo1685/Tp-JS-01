import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' // 👈 Importar correctamente
import { Button } from 'primereact/button'

const PdfGenerator = ({ data }) => {
  const generatePdf = () => {
    const doc = new jsPDF()
    doc.text('Lista de Unicornios', 14, 16)

    const tableData = data.map((u) => [u.nombre, u.color, u.poder, u.edad]) // 👈 Incluí 'poder' si lo querés
    autoTable(doc, {
      head: [['Nombre', 'Color', 'Poder', 'Edad']],
      body: tableData,
      startY: 20
    })

    doc.save('unicornios.pdf')
  }

  return (
    <Button
      label="Generar PDF"
      icon="pi pi-file-pdf"
      className="p-button-secondary"
      onClick={generatePdf}
    />
  )
}

export default PdfGenerator
