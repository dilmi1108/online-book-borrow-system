// Mock data for books
const mockBooks = [
    {
        id: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        year: 1960,
        description: "A gripping tale of racial injustice and childhood innocence in the Deep South. Through the eyes of Scout Finch, we witness her father's courageous defense of a black man falsely accused of rape.",
        image: "https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg",
        available: true,
        totalCopies: 3,
        availableCopies: 2
    },
    {
        id: 2,
        title: "1984",
        author: "George Orwell",
        genre: "Science Fiction",
        year: 1949,
        description: "A dystopian masterpiece that explores themes of surveillance, truth, and freedom in a totalitarian society ruled by Big Brother.",
        image: "https://images.pexels.com/photos/1130624/pexels-photo-1130624.jpeg",
        available: true,
        totalCopies: 5,
        availableCopies: 3
    },
    {
        id: 3,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Romance",
        year: 1813,
        description: "A witty and romantic novel about Elizabeth Bennet and her complex relationship with the proud Mr. Darcy in 19th century England.",
        image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
        available: false,
        totalCopies: 2,
        availableCopies: 0
    },
    {
        id: 4,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        year: 1925,
        description: "Set in the Jazz Age, this novel tells the story of Jay Gatsby's pursuit of the American Dream and his obsessive love for Daisy Buchanan.",
        image: "https://images.pexels.com/photos/1130620/pexels-photo-1130620.jpeg",
        available: true,
        totalCopies: 4,
        availableCopies: 1
    },
    {
        id: 5,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
        year: 1997,
        description: "The magical story of a young wizard who discovers his true heritage and begins his education at Hogwarts School of Witchcraft and Wizardry.",
        image: "https://images.pexels.com/photos/1130623/pexels-photo-1130623.jpeg",
        available: true,
        totalCopies: 6,
        availableCopies: 4
    },
    {
        id: 6,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        year: 1954,
        description: "An epic high fantasy adventure following Frodo Baggins and the Fellowship in their quest to destroy the One Ring and defeat the Dark Lord Sauron.",
        image: "https://images.pexels.com/photos/1130641/pexels-photo-1130641.jpeg",
        available: true,
        totalCopies: 3,
        availableCopies: 2
    },
    {
        id: 7,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        genre: "Fiction",
        year: 1951,
        description: "A controversial coming-of-age story narrated by Holden Caulfield, a disaffected teenager wandering through New York City.",
        image: "https://images.pexels.com/photos/1130621/pexels-photo-1130621.jpeg",
        available: false,
        totalCopies: 2,
        availableCopies: 0
    },
    {
        id: 8,
        title: "Dune",
        author: "Frank Herbert",
        genre: "Science Fiction",
        year: 1965,
        description: "A complex science fiction epic set on the desert planet Arrakis, following Paul Atreides as he navigates political intrigue and mystical powers.",
        image: "https://images.pexels.com/photos/1130625/pexels-photo-1130625.jpeg",
        available: true,
        totalCopies: 3,
        availableCopies: 1
    },
    {
        id: 9,
        title: "The Da Vinci Code",
        author: "Dan Brown",
        genre: "Mystery",
        year: 2003,
        description: "A fast-paced thriller combining art history, religious symbolism, and conspiracy theories as Robert Langdon unravels a dangerous mystery.",
        image: "https://images.pexels.com/photos/1130627/pexels-photo-1130627.jpeg",
        available: true,
        totalCopies: 4,
        availableCopies: 3
    },
    {
        id: 10,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Self-Help",
        year: 1988,
        description: "A philosophical novel about Santiago, a young shepherd who travels from Spain to Egypt in search of treasure, discovering the importance of following one's dreams.",
        image: "https://images.pexels.com/photos/1130628/pexels-photo-1130628.jpeg",
        available: true,
        totalCopies: 5,
        availableCopies: 4
    },
    {
        id: 11,
        title: "Gone Girl",
        author: "Gillian Flynn",
        genre: "Thriller",
        year: 2012,
        description: "A psychological thriller about a marriage gone wrong when Amy Dunne disappears and her husband Nick becomes the prime suspect.",
        image: "https://images.pexels.com/photos/1130629/pexels-photo-1130629.jpeg",
        available: true,
        totalCopies: 3,
        availableCopies: 2
    },
    {
        id: 12,
        title: "Steve Jobs",
        author: "Walter Isaacson",
        genre: "Biography",
        year: 2011,
        description: "The definitive biography of Apple's co-founder, revealing the man behind the revolutionary technology that changed our world.",
        image: "https://images.pexels.com/photos/1130630/pexels-photo-1130630.jpeg",
        available: false,
        totalCopies: 2,
        availableCopies: 0
    }
];

// Default users for demo
const defaultUsers = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        password: "password123",
        membershipId: "LIB001",
        joinDate: "2024-01-15",
        borrowedBooks: [],
        readingHistory: []
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@email.com",
        password: "password123",
        membershipId: "LIB002",
        joinDate: "2024-02-20",
        borrowedBooks: [],
        readingHistory: []
    }
];

// Initialize data in localStorage if not present
function initializeData() {
    if (!localStorage.getItem('libraryBooks')) {
        localStorage.setItem('libraryBooks', JSON.stringify(mockBooks));
    }
    
    if (!localStorage.getItem('libraryUsers')) {
        localStorage.setItem('libraryUsers', JSON.stringify(defaultUsers));
    }
}

// Call initialization
initializeData();