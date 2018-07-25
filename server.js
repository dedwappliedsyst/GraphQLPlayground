import express from 'express';
import express_graphql from 'express-graphql';
import { buildSchema } from 'graphql';
import { courses } from './data/courses';

const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }
    type Course {
        id: Int
        title: String
        description: String
        topic: String
    }
`);

const getCourse = args => courses.find(course => course.id === args.id);
const getCourses = args => {
    if (!args.topic) {
        return courses;
    }

    return courses.filter(course => course.topic === args.topic);
}

const root = {
    course: getCourse,
    courses: getCourses
};

const app = express();
app.use('/graphql', express_graphql({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(1480, () =>
    console.log('Running on http://localhost:1480/graphql')
);