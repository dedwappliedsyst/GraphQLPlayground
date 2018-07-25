import express from 'express';
import expressGraphql from 'express-graphql';
import { buildSchema } from 'graphql';
import { courses } from './data/courses';

const schemaDefinition = `
type Query {
    course(id: Int!): Course
    courses(topic: String): [Course]
},
type Mutation {
    updateCourseTitle(id: Int!, title: String!): Course
}
type Course {
    id: Int
    title: String
    description: String
    topic: String
}`;

const schema = buildSchema(schemaDefinition);

const getCourse = args => courses.find(course => course.id === args.id);

const getCourses = (args) => {
    if (!args.topic) {
        return courses;
    }

    return courses.filter(course => course.topic === args.topic);
};

const root = {
    course: getCourse,
    courses: getCourses
};

const app = express();
const options = {
    schema,
    rootValue: root,
    graphiql: true
};

app.use('/graphql', expressGraphql(options));
app.listen(1480, () => console.log('Running on http://localhost:1480/graphql'));
