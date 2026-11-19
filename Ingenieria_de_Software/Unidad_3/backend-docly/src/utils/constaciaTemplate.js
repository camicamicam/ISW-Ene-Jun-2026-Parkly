const PrinterModule = require('pdfmake/js/Printer');
const PdfPrinter = PrinterModule.default || PrinterModule;

const fonts = {
    Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
    },
};

const printer = new PdfPrinter(fonts);

/**
 * @param {Object} datos
 * @param {Object} res
 */
async function generarConstancia(datos, res) {
    // 1. Preparamos las 6 filas del reverso (Temas 1-6 a la izquierda, 7-12 a la derecha)
    const temario = datos.temario || [];
    const filasContenido = [
        [
            {
                text: "CONTENIDO",
                colSpan: 6,
                bold: true,
                alignment: "center",
                fillColor: "#f2f2f2",
            },
            {},
            {},
            {},
            {},
            {},
        ],
        [
            { text: "NO.", bold: true, alignment: "center", fillColor: "#f2f2f2" },
            { text: "TEMA", bold: true, alignment: "center", fillColor: "#f2f2f2" },
            { text: "HRS.", bold: true, alignment: "center", fillColor: "#f2f2f2" },
            { text: "NO.", bold: true, alignment: "center", fillColor: "#f2f2f2" },
            { text: "TEMA", bold: true, alignment: "center", fillColor: "#f2f2f2" },
            { text: "HRS.", bold: true, alignment: "center", fillColor: "#f2f2f2" },
        ],
    ];

    for (let i = 0; i < 6; i++) {
        const izq = temario[i] || { tema: " ", horas: " " };
        const der = temario[i + 6] || { tema: " ", horas: " " };

        filasContenido.push([
            { text: `${i + 1}`, alignment: "center", margin: [0, 4, 0, 4] },
            { text: izq.tema || " ", margin: [4, 4, 4, 4] },
            {
                text: izq.horas ? `${izq.horas}` : " ",
                alignment: "center",
                margin: [0, 4, 0, 4],
            },
            { text: `${i + 7}`, alignment: "center", margin: [0, 4, 0, 4] },
            { text: der.tema || " ", margin: [4, 4, 4, 4] },
            {
                text: der.horas ? `${der.horas}` : " ",
                alignment: "center",
                margin: [0, 4, 0, 4],
            },
        ]);
    }

    // 2. Definición estructural del documento (Anverso + Reverso)
    const docDefinition = {
        pageSize: "LETTER",
        pageMargins: [55, 50, 55, 50],
        defaultStyle: {
            font: "Helvetica",
            fontSize: 10,
            color: "#1a1a1a",
        },
        content: [
            // ==========================================
            // PÁGINA 1: ANVERSO
            // ==========================================
            // Nota: Si luego se agregan logos en Base64, se puede poner un bloque `columns` aquí arriba
            { text: "\n\n" },

            {
                text: "EL TECNOLÓGICO NACIONAL DE MÉXICO",
                fontSize: 15,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 6],
            },
            {
                text: "INSTITUTO TECNOLÓGICO DE QUERÉTARO",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 0, 0, 30],
            },
            {
                text: "otorga la presente",
                fontSize: 11,
                alignment: "center",
                margin: [0, 0, 0, 15],
            },
            {
                text: "CONSTANCIA",
                fontSize: 22,
                bold: true,
                alignment: "center",
                characterSpacing: 2,
                margin: [0, 0, 0, 15],
            },
            {
                text: "a",
                fontSize: 11,
                alignment: "center",
                margin: [0, 0, 0, 20],
            },
            {
                text: datos.nombre_completo,
                fontSize: 16,
                bold: true,
                alignment: "center",
                margin: [0, 0, 0, 25],
            },
            {
                text: "Por su participación en el curso de actualización profesional",
                fontSize: 11,
                alignment: "center",
                margin: [0, 0, 0, 12],
            },
            {
                text: `“${datos.nombre_curso}”`,
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [20, 0, 20, 20],
            },
            {
                text: `Impartido del ${datos.fecha_inicio} al ${datos.fecha_fin} en el Instituto\nTecnológico de Querétaro, con una duración de ${datos.total_horas} horas.`,
                fontSize: 11,
                alignment: "center",
                lineHeight: 1.4,
                margin: [0, 0, 0, 35],
            },
            {
                text: `Querétaro, Qro. ${datos.fecha_emision}`,
                fontSize: 10.5,
                alignment: "center",
                margin: [0, 0, 0, 25],
            },
            {
                text: "“EXCELENCIA EN EDUCACIÓN TECNOLÓGICA”\n“LA TIERRA SERÁ, COMO SEAN LOS HOMBRES”",
                fontSize: 7.5,
                color: "#555555",
                alignment: "center",
                lineHeight: 1.3,
                margin: [0, 0, 0, 65],
            },
            {
                text: `${datos.nombre_director || "RAMÓN SOTO ARRIOLA"}\nDIRECTOR`,
                fontSize: 10,
                bold: true,
                alignment: "center",
                lineHeight: 1.3,
                pageBreak: "after", // Salto obligatorio a la Página 2
            },

            // ==========================================
            // PÁGINA 2: REVERSO
            // ==========================================
            {
                table: {
                    widths: ["50%", "50%"],
                    body: [
                        [
                            {
                                text: "FORMA DE IMPARTICIÓN",
                                bold: true,
                                alignment: "center",
                                margin: [0, 4, 0, 4],
                            },
                            {
                                text: datos.forma_imparticion || "Presencial",
                                alignment: "center",
                                margin: [0, 4, 0, 4],
                            },
                        ],
                        [
                            {
                                text: "ÁREA DE ADSCRIPCIÓN",
                                bold: true,
                                alignment: "center",
                                margin: [0, 4, 0, 4],
                            },
                            {
                                text: datos.area_adscripcion || "ACADÉMICA",
                                alignment: "center",
                                margin: [0, 4, 0, 4],
                            },
                        ],
                    ],
                },
                fontSize: 9,
                margin: [0, 10, 0, 25],
            },

            // Tabla de Contenido (12 temas)
            {
                table: {
                    widths: [28, "*", 35, 28, "*", 35],
                    body: filasContenido,
                },
                fontSize: 8.5,
                margin: [0, 0, 0, 35],
            },

            // Cuadros de Validación (3 columnas con bordes)
            {
                table: {
                    widths: ["23%", "45%", "32%"],
                    heights: [120],
                    body: [
                        [
                            // Caja Izquierda: Registro
                            {
                                stack: [
                                    {
                                        text: "VALIDACIÓN",
                                        bold: true,
                                        fontSize: 9,
                                        margin: [0, 5, 0, 35],
                                    },
                                    {
                                        text: `Registro No.\n${datos.numero_registro || "TECNM-163-11-2023"}`,
                                        fontSize: 8,
                                        lineHeight: 1.2,
                                    },
                                ],
                                alignment: "center",
                            },
                            // Caja Central: Clave y Firma Subdirector
                            {
                                stack: [
                                    {
                                        text: "Este Evento quedó Registrado con la Clave",
                                        fontSize: 8,
                                        margin: [0, 4, 0, 2],
                                    },
                                    {
                                        text: datos.clave_evento || "D-23-2-005",
                                        bold: true,
                                        fontSize: 8.5,
                                        margin: [0, 0, 0, 2],
                                    },
                                    {
                                        text: "DEPARTAMENTO DE DESARROLLO ACADÉMICO",
                                        fontSize: 7.5,
                                        margin: [0, 0, 0, 10],
                                    },
                                    {
                                        text: `Querétaro, Qro. a ${datos.fecha_emision}`,
                                        fontSize: 8,
                                        margin: [0, 0, 0, 38],
                                    },
                                    {
                                        text: `${datos.nombre_subdirector || "RAMIRO RICO MARTÍNEZ"}\nSUBDIRECTOR ACADÉMICO`,
                                        bold: true,
                                        fontSize: 8,
                                        lineHeight: 1.2,
                                    },
                                ],
                                alignment: "center",
                            },
                            // Caja Derecha: Sello Institucional
                            {
                                stack: [
                                    {
                                        text: "DEPARTAMENTO DE\nCOMUNICACIÓN Y DIFUSIÓN",
                                        bold: true,
                                        fontSize: 7.5,
                                        color: "#555555",
                                        margin: [0, 35, 0, 15],
                                    },
                                    {
                                        text: "SELLO INSTITUCIONAL",
                                        fontSize: 7,
                                        color: "#777777",
                                    },
                                ],
                                alignment: "center",
                            },
                        ],
                    ],
                },
                margin: [0, 0, 0, 45],
            },

            // Pie de página con código oficial
            {
                columns: [
                    { text: "ITQ-AC-PO-006-07", bold: true, fontSize: 9 },
                    { text: "Rev.1", bold: true, fontSize: 9, alignment: "right" },
                ],
            },
        ],
    };

    // 3. Generamos el stream y lo enviamos directo en la respuesta HTTP
    const pdfDoc = await printer.createPdfKitDocument(docDefinition);
    const nombreArchivo = `Constancia_${datos.nombre_completo.replace(/\s+/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

    pdfDoc.pipe(res);
    pdfDoc.end();
}

module.exports = { generarConstancia };
