import React from 'react';
import Navbar from './Navbar';
import ceoImage from '../images/image2.jpg';
import pokerFaceImage from '../images/image3.jpg';
import monkImage from '../images/vegeta.png';
import robot from "../images/robot.png";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const MeetTheTeam = () => {
  const teamMembers = [
    {
      name: 'Aditya Ray',
      title: 'Bug Exorcist',
      description:
        " tea-loving bug-slayer, fixing code issues one sip at a time.somehow fixes tricky bugs and smooths out glitches, all while savoring favorite brew.",
      email: 'adityaray947@gmail.com',
      photo: ceoImage,
      linkedIn: 'https://www.linkedin.com/in/aditya-ray-672b1a22b/',
      github:'https://github.com/adityaray947',
      passingYear:"MSIT'25"
    },
    {
      name: 'Aman Jha',
      title: 'Database Whisperer',
      description:
        "idea dynamo who kicks off every day with a new, game-changing concept—usually inspired by his latest football match.",
      email: 'ajha70227@gmail.com',
      photo: pokerFaceImage,
       linkedIn: '',
      github:'https://github.com/Aman83490',
      passingYear:"MSIT'25"
    },
    {
      name: 'Yuvraj Singh',
      title: 'Unicorn Wrangler & CSS Sorcerer',
      description:
        "Crafting beautiful designs with maximum ease and minimal effort, all while enjoying a cozy spot on the couch",
      email: 'devyuvraj883@gmail.com',
      photo: monkImage,
       linkedIn: 'https://www.linkedin.com/in/yuvraj-singh-2942781a3/',
      github:'https://github.com/Yuvraj883',
      passingYear:"MSIT'25"
    },
    {
      name: 'Mohit Arora',
      title: 'Learner ++',
      description:
        "Robo_the",
      email: 'mohitarora00777@gmail.com',
      photo: robot,
       linkedIn: 'https://www.linkedin.com/in/mohit8181/',
      github:'https://github.com/mohitarora8181',
      passingYear:"MSIT'26"
    }
  ];

  return (
    <div>
      <Navbar/>
      <div style={styles.pageContainer}>
        <h1 style={styles.heading}>Meet the team</h1>
        <div style={styles.cardContainer}>
          {teamMembers.map((member, index) => (
            <div key={index} style={styles.card}>
              <img src={member.photo} alt={member.name} style={styles.photo} />

              <h3 className='mb-2 text-white' style={styles.cardTitle}>{member.name}</h3>
              <p className='mt-0 mb-2 text-gray-500'>{member.passingYear}</p>

              {/* <p style={styles.cardDescription}>{member.description}</p> */}
              {/* <div style={styles.email}>
                <a href={`mailto:${member.email}`} style={styles.emailLink}>{member.email}</a>
                <p style={styles.cardName}>{member.name}</p>
              </div> */}
              <div className='flex gap-2 justify-start items-center'>


                <a href={`${member.linkedIn}`} target='_blank'>
                <FaLinkedinIn className='text-xl hover:scale-110'/>
                </a>
                <a href={`${member.github}`} target='_blank'>
                <FaGithub className='text-xl hover:scale-110'/>
                </a>

                <a href={`mailto:${member.email}`} target='_blank'>
                  <IoIosMail className='text-xl hover:scale-110'/>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#333',
    minHeight: '100vh',
    color: '#fff',
  },
  heading: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '50px',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  card: {
    border: '1px solid #444',
    borderRadius: '10px',
    padding: '20px',
    width: '360px',
    backgroundColor: '#222',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  photo: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    marginBottom: '15px',
    objectFit: 'cover',
    border: '3px solid #fff',
  },
  cardName: {
    fontSize: '0.6rem',
    color: '#fff',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '1.2rem',
    color: '#bbb',
    marginBottom: '15px',
  },
  cardDescription: {
    fontSize: '0.9rem',
    color: '#ccc',
    marginBottom: '15px',
  },
  email: {
    fontSize: '0.8rem',
    color: '#fff',
    marginTop: '10px',
    textAlign: 'left',
    width: '100%',
  },
  emailLink: {
    color: '#1e90ff',
    textDecoration: 'none',
  },
};

export default MeetTheTeam;
