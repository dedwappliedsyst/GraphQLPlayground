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

const updateCourseTitle = (args) => {
    const course = getCourse(args);

    if (!course) {
        return null;
    }

    course.title = args.title;

    return course;
};

const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTitle
};

const app = express();
const options = {
    schema,
    rootValue: root,
    graphiql: true
};

app.use('/graphql', expressGraphql(options));
app.listen(1480, () => console.log('Running on http://localhost:1480/graphql'));
