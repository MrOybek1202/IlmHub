import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
});

export const Course = mongoose.model('Course', courseSchema);

const experimentSchema = new mongoose.Schema({
  title: String,
  instructions: String,
  materials: [String]
});

export const Experiment = mongoose.model('Experiment', experimentSchema);

export const seedDefaultData = async () => {
  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
    await Course.insertMany([
      { title: 'Introduction to React', description: 'Learn the basics of React', difficulty: 'Beginner' },
      { title: 'Advanced Node.js', description: 'Master server-side JavaScript', difficulty: 'Advanced' }
    ]);
    console.log('Seeded default courses');
  }

  const expCount = await Experiment.countDocuments();
  if (expCount === 0) {
    await Experiment.insertMany([
      { title: 'Volcano Eruption', instructions: 'Mix baking soda and vinegar', materials: ['Baking Soda', 'Vinegar', 'Food Coloring'] }
    ]);
    console.log('Seeded default experiments');
  }
};
