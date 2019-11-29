export default function(filename, content) {
  const elink = document.createElement('a')
  elink.download = `${filename}.xls`
  elink.style.display = 'none'

  var blob = new Blob([content], {
    type: 'application/vnd.ms-excel'
  })
  elink.href = URL.createObjectURL(blob)

  document.body.appendChild(elink)
  elink.click()

  document.body.removeChild(elink)
}
