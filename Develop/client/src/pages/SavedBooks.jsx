import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME, DELETE_BOOK } from '../utils/mutations'; // Import your GraphQL operations

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  
  // Apollo Client hooks for queries and mutations
  const { loading, error, data, refetch } = useQuery(GET_ME, {
    skip: !Auth.loggedIn(), // Skip the query if not logged in
    onCompleted: (data) => setUserData(data.me)
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: (data) => {
      // Refetch user data to update UI
      refetch();
      // Alternatively, you could update local state to reflect the change immediately
      // setUserData(data.deleteBook);
    }
  });

  useEffect(() => {
    // This useEffect is no longer strictly necessary if you're relying on Apollo's caching and refetch,
    // but you can keep it for other side effects or logic you need to run.
  }, [userData]);

  const handleDeleteBook = async (bookId) => {
    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await deleteBook({
        variables: { bookId }
      });
      // Upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h2>LOADING...</h2>;
  if (error) return <p>An error occurred: {error.message}</p>;

  // if userData is not loaded yet, show a loading message or similar
  if (!userData) {
    return <h2>LOADING...</h2>;
  }

  // Return your component JSX properly
  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors.join(', ')}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;