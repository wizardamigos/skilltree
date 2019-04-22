const cors = 'https://cors-anywhere.herokuapp.com/'
const absoluteURLregex = /(?:^[a-z][a-z0-9+.-]*:|\/\/)/

function get_url (url) {
  const isAbsoluteURL = absoluteURLregex.test(url)
  if (isAbsoluteURL) {
    const islocalhost = (url.includes('//localhost')
    || url.includes('//127.0.0.1') || url.includes('//0.0.0.0')
    || url.includes('//10.0.0') || url.includes('//192.168'))
    const sameorigin = new URL(url).origin === location.origin
    return (islocalhost || sameorigin) ? url : cors + url
  }
  return url
}
async function grab (workshop_url) {
  var [workshop_url, workshopjson_url] = workshop2json(workshop_url)
  var workshopjson = localStorage[workshopjson_url] // @TODO: replace by indexdb!!!
  if (workshopjson) return JSON.parse(workshopjson)
  else {
    var workshopjson = await fetch(get_url(workshopjson_url)).then(x => x.json())
    workshopjson.ID = workshop_url
    localStorage[workshopjson_url] = JSON.stringify(workshopjson)
    return workshopjson
  }
}

module.exports = crawler

async function crawler (workshops = []) {
  const jsons = []
  for (var i = 0, len = workshops.length; i < len; i++) {
    const workshopjson = await grab(workshops[i])
    jsons.push(workshopjson)
  }
  var all = [].concat(...await Promise.all(jsons.map(crawlworkshop)))
  // @TODO: probably removing duplicates is wrong, because:
  return removeDuplicates(all, "url")
}

function removeDuplicates (originalArray, prop) {
  var newArray = [], lookupObject = {}
  for (var i in originalArray) lookupObject[originalArray[i][prop]] = originalArray[i]
  for (i in lookupObject) newArray.push(lookupObject[i])
  return newArray
}

function workshop2json (url) {
  var x = url
  x = x.split('?')[0]
  if (!x.includes('://')) x = 'https://' + x
  if (!x.endsWith('.html') && !x.endsWith('/')) x = x + '/'
  var workshop_url = new URL(x).href
  console.log(workshop_url)
  var workshopjson_url = new URL('./workshop.json', workshop_url).href
  return [workshop_url, workshopjson_url]
}
async function crawlworkshop (data) {
  // @TODO: add robust error handling - e.g. if links are broken
  const needs = []
  const unlocks = []
  for (var i = 0, len = data.needs.length; i < len; i++) {
    var workshop_url = data.needs[i]
    const workshopjson = await grab(workshop_url)
    needs.push({
      url: workshopjson.ID,
      parentIds: [],
      id: workshopjson.ID,
      title: workshopjson.title,
      // icon: get_url(workshop.icon)
    })
  }
  for (var i = 0, len = data.unlocks.length; i < len; i++) {
    var workshop_url = data.unlocks[i]
    const workshopjson = await grab(workshop_url)
    unlocks.push({
      url: workshopjson.ID,
      parentIds: [data.ID],
      id: workshopjson.ID,
      title: workshopjson.title,
      // icon: get_url(workshop.icon)
    })
  }
  return [{
    url: data.ID,
    parentIds: [...needs].map(x => x.id),
    id: data.ID,
    title: data.title,
    // icon: get_url(data.icon)
  }, ...needs, ...unlocks]
}
