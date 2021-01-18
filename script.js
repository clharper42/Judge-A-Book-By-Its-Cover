let book1img = document.getElementById('book1')
let book2img = document.getElementById('book2')
let bookfinimg = document.getElementById('finalbook')
let finbookcont = document.getElementById('fin-book-cont')
let finbookimg = document.getElementById('fin-book-link')
let bookchoicecont = document.getElementById('book-choice-cont')
let loadingcont = document.getElementById('loading-cont')
let buttons = document.querySelectorAll('[btnchoice]')

//set response limit
let fetchlimit = 50

//amount of choices made
let btnclicks = 0

//the stored info
let subjectindexone = 0
let subjectindextwo = 0
let book1pages = 0
let books2pages = 0
let book1offest = 0
let book2offest = 0
let subjectone = ''
let subjecttwo = ''
let goodbook = false
let books1 = {}
let book2 = {}
let thebook1 = {}
let thebook2 = {}
let selectedbook = {}
let notselectedbook = {}
let goodsubjects = [
  'fantasy',
  'historical_fiction',
  'horror',
  'humor',
  'literature',
  'mystery_and_detective_stories',
  'plays',
  'poetry',
  'romance',
  'science_fiction',
  'short_stories',
  'thriller',
  'young_adult',
] //used to search
let badsubjects = [] //if final book has any get new one
let goodsubjectstemp = []
let badsubjectstemp = []

//disaply the first two starting books
getstartingbooks()

//Math.floor(Math.random() * (max - min + 1)) + min

async function getstartingbooks() {
  //check on amount of choices made and display final book choice after desidred clicks
  if (btnclicks == 7) {
    console.clear()
    getFinalBook()
  } else {
    //get two random subjects
    subjectindexone =
      Math.floor(Math.random() * (goodsubjects.length - 1 - 0 + 1)) + 0

    subjectindextwo =
      Math.floor(Math.random() * (goodsubjects.length - 1 - 0 + 1)) + 0

    subjectone = goodsubjects[subjectindexone]
    subjectone = subjectone.replace(' ', '_')
    subjectone = subjectone.toLowerCase()
    console.log(subjectone)
    subjecttwo = goodsubjects[subjectindextwo]
    subjecttwo = subjecttwo.replace(' ', '_')
    subjecttwo = subjecttwo.toLowerCase()
    console.log(subjecttwo)

    books1 = {}
    books2 = {}
    thebook1 = {}
    thebook2 = {}

    //get total number of books for those subjects
    books1 = await fetch(
      'http://openlibrary.org/subjects/' +
        subjectone +
        '.json?published_in=1900-2020&limit=' +
        fetchlimit.toString()
    )
      .then((response) => response.json())
      .catch((e) => console.log(e))

    books2 = await fetch(
      'http://openlibrary.org/subjects/' +
        subjecttwo +
        '.json?published_in=1900-2020&limit=' +
        fetchlimit.toString()
    )
      .then((response) => response.json())
      .catch((e) => console.log(e))

    console.log(books1)
    console.log(books2)

    //find number of pages based of limit and find offest
    book1pages = Math.floor(books1.work_count / fetchlimit)
    books2pages = Math.floor(books2.work_count / fetchlimit)

    book1offest = Math.floor(Math.random() * (book1pages - 0 + 1)) + 0
    book2offest = Math.floor(Math.random() * (books2pages - 0 + 1)) + 0

    console.log(book1offest)
    console.log(book2offest)

    //get random books and dispaly cover
    books1 = await fetch(
      'http://openlibrary.org/subjects/' +
        subjectone +
        '.json?published_in=1900-2020&limit=' +
        fetchlimit.toString() +
        '&offset=' +
        book1offest.toString()
    )
      .then((response) => response.json())
      .catch((e) => console.log(e))

    books2 = await fetch(
      'http://openlibrary.org/subjects/' +
        subjecttwo +
        '.json?published_in=1900-2020&limit=' +
        fetchlimit.toString() +
        '&offset=' +
        book2offest.toString()
    )
      .then((response) => response.json())
      .catch((e) => console.log(e))

    let rangeofnumofbooks = [...Array(books1.works.length - 1).keys()]
    while (rangeofnumofbooks.length != 0) {
      let index =
        Math.floor(Math.random() * (rangeofnumofbooks.length - 1 - 0 + 1)) + 0
      thebook1 = books1.works[rangeofnumofbooks[index]]
      rangeofnumofbooks.splice(index, 1)
      if (thebook1.cover_id !== null) {
        break
      } else {
        console.log('book one cover id is null')
      }
    }

    rangeofnumofbooks = [...Array(books2.works.length - 1).keys()]
    while (rangeofnumofbooks.length != 0) {
      let index =
        Math.floor(Math.random() * (rangeofnumofbooks.length - 1 - 0 + 1)) + 0
      thebook2 = books2.works[rangeofnumofbooks[index]]
      rangeofnumofbooks.splice(index, 1)
      if (thebook2.cover_id !== null) {
        break
      } else {
        console.log('book two cover id is null')
      }
    }

    book1img.src =
      'http://covers.openlibrary.org/b/id/' +
      thebook1.cover_id.toString() +
      '-L.jpg'

    book2img.src =
      'http://covers.openlibrary.org/b/id/' +
      thebook2.cover_id.toString() +
      '-L.jpg'

    loadingcont.style.opacity = 0
    loadingcont.style.zIndex = -2
    bookchoicecont.style.opacity = 1
    bookchoicecont.style.zIndex = 1
  }
}

async function getFinalBook() {
  bookchoicecont.style.opacity = 0
  bookchoicecont.style.zIndex = -2
  loadingcont.style.opacity = 1
  loadingcont.style.zIndex = 1

  //fiction is too broad to be in badsubjects
  if (badsubjects.indexOf('fiction') != -1) {
    badsubjects.splice(badsubjects.indexOf('fiction'), 1)
  }
  books1 = {}
  thebook1 = {}
  goodbook = false
  //create an array that is [0...x] where is x is total number of possible subjects to pull from so that you know which subjects you have pulled from
  let goodsubjectslengthrange = [...Array(goodsubjects.length).keys()]
  while (goodsubjectslengthrange.length > 0) {
    //get index of subject and remove index from range array
    subjectindexone =
      Math.floor(Math.random() * (goodsubjectslengthrange.length - 1 - 0 + 1)) +
      0

    //get subject and fetch to get total amount of books in subjects
    subjectone = goodsubjects[goodsubjectslengthrange[subjectindexone]]
    goodsubjectslengthrange.splice(subjectindexone, 1)
    subjectone = subjectone.replace(' ', '_')
    subjectone = subjectone.toLowerCase()
    console.log(subjectone)

    books1 = await fetch(
      'http://openlibrary.org/subjects/' +
        subjectone +
        '.json?published_in=1900-2020&limit=' +
        fetchlimit.toString()
    )
      .then((response) => response.json())
      .catch((e) => console.log(e))

    //create an array that is [0...x] where is x is total number of possible pages of books to pull from so that you know which pages you have pulled from
    book1pages = Math.floor(books1.work_count / fetchlimit)
    let bookpagesrange = [...Array(book1pages).keys()]
    while (bookpagesrange.length > 0) {
      book1offest =
        Math.floor(Math.random() * (bookpagesrange.length - 1 - 0 + 1)) + 0

      //fetch a page of books
      books1 = await fetch(
        'http://openlibrary.org/subjects/' +
          subjectone +
          '.json?published_in=1900-2020&limit=' +
          fetchlimit.toString() +
          '&offset=' +
          bookpagesrange[book1offest].toString()
      )
        .then((response) => response.json())
        .catch((e) => console.log(e))

      bookpagesrange.splice(book1offest, 1)

      //create an array that is [0...x] where is x is total number of possible books to pull from so that you know which books you have pulled from
      goodbook = true
      let bookslenghtrange = [...Array(books1.works.length).keys()]
      while (bookslenghtrange.length > 0) {
        goodbook = true
        //get index of random from range and remove the index from the range
        let testindex =
          Math.floor(Math.random() * (bookslenghtrange.length - 1 - 0 + 1)) + 0

        thebook1 = books1.works[bookslenghtrange[testindex]]

        bookslenghtrange.splice(testindex, 1)
        if (thebook1.cover_id !== null) {
          //check the book to see if it has any subjects that showed in books you did not select and if so get another book from the page
          for (let subject of thebook1.subject) {
            subject = subject.replace(' ', '_')
            subject = subject.toLowerCase()
            if (badsubjects.indexOf(subject) != -1) {
              goodbook = false
              console.log('book had bad subject')
              break
            }
          }
        } else goodbook = false
        if (goodbook) {
          break
        }
      }
      if (goodbook) {
        break
      } else {
        //triggers if no books on the page are valid and the loop with select a new one
        console.log('need new offset')
      }
    }
    if (goodbook) {
      break
    } else {
      //triggers if no books in the subject are valid and the loop will select a new one
      console.log('need new subject')
    }
  }
  if (goodbook) {
    //When a valid book is found dispaly it's cover and link to its webpage
    console.log('book subjects')
    console.log(thebook1.subject)
    console.log('bad subjects')
    console.log(badsubjects)
    bookfinimg.src =
      'http://covers.openlibrary.org/b/id/' +
      thebook1.cover_id.toString() +
      '-L.jpg'

    finbookimg.href =
      'https://openlibrary.org/works/' + thebook1.cover_edition_key
    loadingcont.style.opacity = 0
    loadingcont.style.zIndex = -1
    finbookcont.style.opacity = 1
    finbookcont.style.zIndex = 1
  } else {
    console.log('NO GOOD SUBJECTS')
  }
}

buttons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    console.clear()
    bookchoicecont.style.opacity = 0
    bookchoicecont.style.zIndex = -2
    loadingcont.style.opacity = 1
    loadingcont.style.zIndex = 1

    btnclicks++

    //checks which book was selected and puts them in the proper varaible
    if (btn.id.charAt(btn.id.length - 1) === '1') {
      selectedbook = thebook1
      notselectedbook = thebook2
    } else {
      selectedbook = thebook2
      notselectedbook = thebook1
    }
    console.log('selected')
    console.log(selectedbook)
    console.log('not selected')
    console.log(notselectedbook)

    //filter so that if subjects shows in goodsubject temp it does not show in badsubject temp and vice versa
    goodsubjectstemp = selectedbook.subject.filter(
      (e) => notselectedbook.subject.indexOf(e) == -1
    )

    badsubjectstemp = notselectedbook.subject.filter(
      (e) => selectedbook.subject.indexOf(e) == -1
    )

    //Remove from goodsubjects what is in badtemp and vice versa
    goodsubjects = goodsubjects.filter((e) => badsubjectstemp.indexOf(e) == -1)
    badsubjects = badsubjects.filter((e) => goodsubjectstemp.indexOf(e) == -1)

    //Add to goodsubject what is new and vice versa and makes sure it has no special characters
    goodsubjectstemp.forEach(function (e) {
      if (
        goodsubjects.indexOf(e) == -1 &&
        !/[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g.test(e)
      ) {
        goodsubjects.push(e)
      }
    })

    badsubjectstemp.forEach(function (e) {
      if (
        badsubjects.indexOf(e) == -1 &&
        !/[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g.test(e)
      ) {
        badsubjects.push(e)
      }
    })

    console.log('good')
    console.log(goodsubjects)
    console.log('bad')
    console.log(badsubjects)
    console.log('--------------------------')

    selectedbook = {}
    notselectedbook = {}
    getstartingbooks()
  })
})
