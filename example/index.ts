import { ConsumeServer, Request, Response } from '../lib';
import createServer from '../lib/server';

type User = {
  firstname: string;
  surname: string;
  age: number;
};

const users: User[] = [
  { firstname: 'Thomas', surname: 'Fischer', age: 76 },
  { firstname: 'Wesley', surname: 'Martin', age: 64 },
  { firstname: 'Nicholas', surname: 'Marshall', age: 74 },
  { firstname: 'Juan', surname: 'Terry', age: 19 },
  { firstname: 'Teresa', surname: 'Hudson', age: 74 },
  { firstname: 'Michael', surname: 'Jackson', age: 29 },
  { firstname: 'Derek', surname: 'Leblanc', age: 94 },
  { firstname: 'Evelyn', surname: 'Cisneros', age: 98 },
  { firstname: 'Janice', surname: 'Lang', age: 21 },
  { firstname: 'Timothy', surname: 'Santiago', age: 70 },
  { firstname: 'Jeremy', surname: 'Ortiz', age: 34 },
  { firstname: 'Paul', surname: 'Lambert', age: 98 },
  { firstname: 'Lisa', surname: 'Petersen', age: 38 },
  { firstname: 'Travis', surname: 'Crawford', age: 85 },
  { firstname: 'Matthew', surname: 'Rodriguez', age: 47 },
  { firstname: 'Michelle', surname: 'Reyes', age: 88 },
  { firstname: 'Daniel', surname: 'Miller', age: 49 },
  { firstname: 'Richard', surname: 'Little', age: 60 },
  { firstname: 'Heather', surname: 'Fischer', age: 28 },
  { firstname: 'Mallory', surname: 'Munoz', age: 45 },
  { firstname: 'Jason', surname: 'Whitney', age: 70 },
  { firstname: 'Robin', surname: 'Garrett', age: 96 },
  { firstname: 'Jacob', surname: 'Cole', age: 56 },
  { firstname: 'William', surname: 'Byrd', age: 92 },
  { firstname: 'April', surname: 'Allen', age: 56 },
  { firstname: 'Rodney', surname: 'Fitzpatrick', age: 85 },
  { firstname: 'Michelle', surname: 'Burgess', age: 92 },
  { firstname: 'Mitchell', surname: 'Mann', age: 97 },
  { firstname: 'Robert', surname: 'Dudley', age: 33 },
  { firstname: 'Sean', surname: 'Cox', age: 63 },
  { firstname: 'Cheyenne', surname: 'Peterson', age: 100 },
  { firstname: 'Misty', surname: 'Turner', age: 60 },
  { firstname: 'John', surname: 'Woods', age: 51 },
  { firstname: 'Jennifer', surname: 'Freeman', age: 84 },
  { firstname: 'Joshua', surname: 'Simon', age: 80 },
  { firstname: 'Karen', surname: 'Wright', age: 66 },
  { firstname: 'Todd', surname: 'Cole', age: 73 },
  { firstname: 'Steven', surname: 'Johnston', age: 88 },
  { firstname: 'Mario', surname: 'Stanley', age: 26 },
  { firstname: 'Stacey', surname: 'Cisneros', age: 59 },
  { firstname: 'Jasmine', surname: 'Nicholson', age: 67 },
  { firstname: 'Lisa', surname: 'Vazquez', age: 50 },
  { firstname: 'Megan', surname: 'Owen', age: 32 },
  { firstname: 'Nicole', surname: 'Ross', age: 31 },
  { firstname: 'David', surname: 'White', age: 61 },
  { firstname: 'Jerry', surname: 'Johnson', age: 87 },
  { firstname: 'Justin', surname: 'Young', age: 47 },
  { firstname: 'Ricky', surname: 'Lowery', age: 53 },
  { firstname: 'Brandon', surname: 'Turner', age: 51 },
  { firstname: 'Jesse', surname: 'Davis', age: 50 },
  { firstname: 'Deborah', surname: 'Jordan', age: 84 },
  { firstname: 'Crystal', surname: 'Wilson', age: 45 },
  { firstname: 'Mary', surname: 'Wright', age: 20 },
  { firstname: 'Carol', surname: 'Bell', age: 41 },
  { firstname: 'Brittany', surname: 'Warren', age: 85 },
  { firstname: 'Rebecca', surname: 'Anderson', age: 76 },
  { firstname: 'Kevin', surname: 'Fitzpatrick', age: 66 },
  { firstname: 'Gabrielle', surname: 'Jackson', age: 67 },
  { firstname: 'Rebecca', surname: 'Francis', age: 54 },
  { firstname: 'Kayla', surname: 'Ayala', age: 23 },
  { firstname: 'William', surname: 'Perez', age: 46 },
  { firstname: 'Benjamin', surname: 'Byrd', age: 49 },
  { firstname: 'Michael', surname: 'Murphy', age: 26 },
  { firstname: 'Glenn', surname: 'Ford', age: 64 },
  { firstname: 'Gregory', surname: 'Curry', age: 61 },
  { firstname: 'Lindsay', surname: 'Stewart', age: 38 },
  { firstname: 'Jessica', surname: 'Rice', age: 23 },
  { firstname: 'Robin', surname: 'Johnson', age: 26 },
  { firstname: 'Jacob', surname: 'Walton', age: 43 },
  { firstname: 'Angela', surname: 'Macias', age: 70 },
  { firstname: 'Miranda', surname: 'Williams', age: 36 },
  { firstname: 'Ashley', surname: 'Weiss', age: 82 },
  { firstname: 'Tracy', surname: 'Lindsey', age: 84 },
  { firstname: 'Vanessa', surname: 'Dawson', age: 92 },
  { firstname: 'Brian', surname: 'Owens', age: 45 },
  { firstname: 'Pamela', surname: 'Wiley', age: 73 },
  { firstname: 'Adrian', surname: 'Vasquez', age: 61 },
  { firstname: 'Gloria', surname: 'Colon', age: 90 },
  { firstname: 'Julia', surname: 'Sharp', age: 41 },
  { firstname: 'Jocelyn', surname: 'Martinez', age: 30 },
  { firstname: 'Melissa', surname: 'Riley', age: 85 },
  { firstname: 'Jeffrey', surname: 'Roth', age: 43 },
  { firstname: 'Ashley', surname: 'Hernandez', age: 53 },
  { firstname: 'Cynthia', surname: 'Reynolds', age: 25 },
  { firstname: 'Courtney', surname: 'Henderson', age: 88 },
  { firstname: 'Melanie', surname: 'Watkins', age: 39 },
  { firstname: 'Stacey', surname: 'Hogan', age: 33 },
  { firstname: 'Anthony', surname: 'White', age: 95 },
  { firstname: 'Steven', surname: 'Nelson', age: 84 },
  { firstname: 'Cheryl', surname: 'Roach', age: 63 },
  { firstname: 'Douglas', surname: 'Stanton', age: 92 },
  { firstname: 'Christopher', surname: 'Nelson', age: 63 },
  { firstname: 'Jeremy', surname: 'Villa', age: 40 },
  { firstname: 'Nicholas', surname: 'Petersen', age: 55 },
  { firstname: 'Steven', surname: 'Mckee', age: 40 },
  { firstname: 'Joshua', surname: 'Hernandez', age: 71 },
  { firstname: 'Anthony', surname: 'Rowe', age: 70 },
  { firstname: 'Lindsey', surname: 'Soto', age: 26 },
  { firstname: 'Andrea', surname: 'Lynch', age: 88 },
  { firstname: 'Stacy', surname: 'Johnson', age: 88 }
];

const server: ConsumeServer = createServer({
  port: 3000,
  useSecureHeaders: true
});

server.get('/users', (request: Request, response: Response) => {
  console.log(request.body);
  console.log(request.searchParams);
  console.log(request.urlParams);
  response.reply(200, { users });
});

server.start(() => {
  console.log('Test API is live!');
});
