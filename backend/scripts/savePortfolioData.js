const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'your_database_name'; // 👈 Replace this with your DB name

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);

    // Read JSON file
    const filePath = path.join(__dirname, 'PortfolioUserData.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Save UserInfo
    await db.collection('userInfo').insertOne({
      name: data.name,
      photo: data.photo,
      description: data.description,
    });

    // Save Contacts
    const contacts = data.contacts.map(c => ({
      type: c.type,
      value: c.value,
    }));
    await db.collection('contacts').insertMany(contacts);

    // Save Education
    const education = data.education.map(e => ({
      degree: e.degree,
      institution: e.institution,
      year: e.year,
    }));
    await db.collection('education').insertMany(education);

    // Save Experience
    const experiences = data.experience.map(e => ({
      position: e.position,
      company: e.company,
      year: e.year,
    }));
    await db.collection('experience').insertMany(experiences);

    // Save Projects
    const projects = data.projects.map(p => ({
      name: p.name,
      description: p.description,
      image: p.image,
      technologies: p.technologies,
      link: p.link,
    }));
    await db.collection('projects').insertMany(projects);

    // Save Skills
    const skills = data.skills.map(skill => ({ name: skill }));
    await db.collection('skills').insertMany(skills);

    // Save Social Links
    const socialLinks = data.socialLinks.map(s => ({
      platform: s.platform,
      url: s.url,
    }));
    await db.collection('socialLinks').insertMany(socialLinks);

    console.log('✅ All data saved successfully!');
  } catch (err) {
    console.error('❌ Error saving data:', err);
  } finally {
    await client.close();
  }
}

run();
