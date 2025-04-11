'use client';
import React, { FormEvent, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import styled from 'styled-components';

// Updated path array for "JoBless"
const pathArr = [
  'M11.40 20.40L19.40 20.40L19.40 40.45Q19.40 46.55 16.80 49.52Q14.20 52.50 8 52.50Q5.45 52.50 3.70 52.25Q1.95 52 0 51.35L0 44.50L0.20 44.40Q1.75 44.90 3.10 45.15Q4.45 45.40 6.45 45.40Q8.55 45.40 9.63 44.92Q10.70 44.45 11.08 43.20Q11.45 41.95 11.45 39.60L11.40 20.40Z',
  'M23.40 40.05Q23.40 33.35 26.25 30.40Q29.10 27.45 35.90 27.45Q40.45 27.45 43.20 28.75Q45.95 30.05 47.18 32.83Q48.40 35.60 48.40 40.05Q48.40 44.45 47.18 47.20Q45.95 49.95 43.20 51.23Q40.45 52.50 35.90 52.50Q29.10 52.50 26.25 49.58Q23.40 46.65 23.40 40.05M35.90 45.65Q38.80 45.65 39.83 44.38Q40.85 43.10 40.85 39.90Q40.85 36.85 39.83 35.52Q38.80 34.20 35.90 34.20Q33.10 34.20 32.03 35.52Q30.95 36.85 30.95 39.90Q30.95 43.10 32.03 44.38Q33.10 45.65 35.90 45.65Z',
  'M79.45 43.95Q79.45 47.95 76.98 50Q74.50 52.05 68.25 52.05L52.65 52.05L52.65 20.40L54.60 20.40L54.60 20.40L67.75 20.40Q71.90 20.40 74.23 21.27Q76.55 22.15 77.50 23.85Q78.45 25.55 78.45 28.10Q78.45 31.60 76.78 33.52Q75.10 35.45 70.50 35.85L70.50 36Q73.90 36.25 75.85 37.13Q77.80 38 78.63 39.65Q79.45 41.30 79.45 43.95M65.55 26.70L60.65 26.70L60.65 32.90L65.55 32.90Q68 32.90 69.10 32.27Q70.20 31.65 70.20 29.80Q70.20 28 69.10 27.35Q68 26.70 65.55 26.70M66.55 39.45L60.65 39.45L60.65 45.80L66.55 45.80Q69 45.80 70.10 45.13Q71.20 44.45 71.20 42.60Q71.20 40.70 70.10 40.08Q69 39.45 66.55 39.45Z',
  'M91.95 52.05L83.95 52.05L83.95 18.40L91.95 18.40L91.95 52.05Z',
  'M119.40 51.25Q118 51.75 115.53 52.13Q113.05 52.50 109.65 52.50Q105.35 52.50 102.33 51.38Q99.30 50.25 97.75 47.52Q96.20 44.80 96.20 39.95Q96.20 33.35 99.23 30.40Q102.25 27.45 108.60 27.45Q113.15 27.45 115.78 28.75Q118.40 30.05 119.53 32.42Q120.65 34.80 120.65 38.05Q120.65 39 120.58 40.10Q120.50 41.20 120.30 42.25L120.10 42.45L103.65 42.45Q104 44.65 105.73 45.35Q107.45 46.05 111.35 46.05Q113.95 46.05 115.68 45.92Q117.40 45.80 119.20 45.55L119.40 45.70L119.40 51.25M113.70 37.20Q113.70 36 113.33 35.13Q112.95 34.25 111.85 33.77Q110.75 33.30 108.60 33.30Q105.45 33.30 104.48 34.38Q103.50 35.45 103.50 37.20L113.70 37.20Z',
  'M123.80 45.15Q127.70 46.25 132.45 46.25Q134.75 46.25 135.90 46.10Q137.05 45.95 137.45 45.60Q137.85 45.25 137.85 44.65Q137.85 43.80 137.22 43.60Q136.60 43.40 134.75 43.05L130.80 42.30Q127 41.55 125.33 39.92Q123.65 38.30 123.65 35.05Q123.65 30.65 126.28 29.05Q128.90 27.45 134.65 27.45Q138.10 27.45 140.72 27.82Q143.35 28.20 145.10 28.75L145 34.80L144.85 34.95Q140.80 33.65 136 33.65Q133.65 33.65 132.72 33.97Q131.80 34.30 131.80 35.25Q131.80 35.75 132.08 36.05Q132.35 36.35 133.35 36.63Q134.35 36.90 136.50 37.30L140.15 38Q143.20 38.65 144.65 40.15Q146.10 41.65 146.10 44.90Q146.10 47.75 145.05 49.42Q144 51.10 141.53 51.80Q139.05 52.50 134.70 52.50Q131.40 52.50 128.63 52.17Q125.85 51.85 123.65 51.40L123.65 45.25L123.80 45.15Z',
  'M149.25 45.15Q153.15 46.25 157.90 46.25Q160.20 46.25 161.35 46.10Q162.50 45.95 162.90 45.60Q163.30 45.25 163.30 44.65Q163.30 43.80 162.68 43.60Q162.05 43.40 160.20 43.05L156.25 42.30Q152.45 41.55 150.78 39.92Q149.10 38.30 149.10 35.05Q149.10 30.65 151.73 29.05Q154.35 27.45 160.10 27.45Q163.55 27.45 166.18 27.82Q168.80 28.20 170.55 28.75L170.45 34.80L170.30 34.95Q166.25 33.65 161.45 33.65Q159.10 33.65 158.18 33.97Q157.25 34.30 157.25 35.25Q157.25 35.75 157.53 36.05Q157.80 36.35 158.80 36.63Q159.80 36.90 161.95 37.30L165.60 38Q168.65 38.65 170.10 40.15Q171.55 41.65 171.55 44.90Q171.55 47.75 170.50 49.42Q169.45 51.10 166.98 51.80Q164.50 52.50 160.15 52.50Q156.85 52.50 154.08 52.17Q151.30 51.85 149.10 51.40L149.10 45.25L149.25 45.15Z'
];

const StyledWrapper = styled.div`
  .input-wrapper {
    width: fit-content;
    height: 45px;
    border-radius: 20px;
    padding: 5px;
    box-sizing: content-box;
    display: flex;
    align-items: center;
    background-color: #292524;
  }

  .icon {
    width: 30px;
    fill: rgb(255, 255, 255);
    margin-left: 8px;
    transition: all 0.3s;
  }
  .input {
    max-width: 170px;
    height: 100%;
    border: none;
    outline: none;
    padding-left: 15px;
    background-color: #292524;
    color: white;
    font-size: 1em;
  }
  .input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #292524 inset;
    -webkit-text-fill-color: #ffffff;
  }
  .Subscribe-btn {
    height: 100%;
    width: 95px;
    border: none;
    border-radius: 15px;
    color: rgb(0, 0, 0);
    cursor: pointer;
    background-color: #ffffff;
    font-weight: 500;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s;
  }
  .arrow {
    position: absolute;
    margin-right: 150px;
    transition: all 0.3s;
  }
  .input-wrapper:active .icon {
    transform: scale(1.3);
  }
  .Subscribe-btn:hover {
    color: white;
  }
  .Subscribe-btn:hover .arrow {
    margin-right: 0;
    animation: jello-vertical 0.9s both;
    transform-origin: right;
  }

  @keyframes jello-vertical {
    0% {
      transform: scale3d(1, 1, 1);
    }
    30% {
      transform: scale3d(0.75, 1.25, 1);
    }
    40% {
      transform: scale3d(1.25, 0.75, 1);
    }
    50% {
      transform: scale3d(0.85, 1.15, 1);
    }
    65% {
      transform: scale3d(1.05, 0.95, 1);
    }
    75% {
      transform: scale3d(0.95, 1.05, 1);
    }
    100% {
      transform: scale3d(1, 1, 1);
    }
  }
  .Subscribe-btn:active {
    transform: scale(0.9);
  }
`;

const NewsletterInput = () => {
  return (
    <StyledWrapper>
      <div className="input-wrapper">
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g data-name="Layer 2">
            <g data-name="inbox">
              <rect width={24} height={24} transform="rotate(180 12 12)" opacity={0} />
              <path d="M20.79 11.34l-3.34-6.68A3 3 0 0 0 14.76 3H9.24a3 3 0 0 0-2.69 1.66l-3.34 6.68a2 2 0 0 0-.21.9V18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5.76a2 2 0 0 0-.21-.9zM8.34 5.55a1 1 0 0 1 .9-.55h5.52a1 1 0 0 1 .9.55L18.38 11H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 0-1-1H5.62z" />
            </g>
          </g>
        </svg>
        <input type="text" name="text" className="input" placeholder="info@gmail.com" />
        <button className="Subscribe-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width={30} height={10} viewBox="0 0 38 15" className="arrow">
            <path d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z" /></svg>Subscribe
        </button>
      </div>
    </StyledWrapper>
  );
}

const Footer = () => {
  const container = useRef<HTMLDivElement>(null);
  const [openPopup, setOpenPopUp] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref);

  const variants = {
    visible: (i: any) => ({
      translateY: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration: 0.4,
        delay: i * 0.03,
      },
    }),

    hidden: { translateY: 200 },
  };
  
  const handleNewsLetterData = (e: FormEvent) => {
    e.preventDefault();
    // Could implement newsletter subscription here
    setOpenPopUp(true);
    if (setOpenPopUp) {
      setTimeout(() => {
        setOpenPopUp(false);
      }, 2000);
    }
  };

  return (
    <>
      {openPopup && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>Thanks for subscribing to our newsletter!</p>
        </div>
      )}

      <div
        className='relative h-full sm:pt-14 pt-8 bg-[#f7f7f7] text-black'
        ref={container}
      >
        <div className='sm:container px-4 mx-auto'>
          <div className='md:flex justify-between w-full'>
            <div>
              <h1 className='md:text-4xl text-2xl font-semibold'>
                Subscribe for job alerts
              </h1>
              <div className='pt-2 pb-6 md:w-99'>
                <div className='py-4'>
                  <NewsletterInput />
                </div>
              </div>
            </div>
            <div className='flex gap-10'>
              <ul>
                <li className='text-xl font-medium'>
                  <Link href='/privacy-policy'>Privacy Policy</Link>
                </li>
                <li className='text-xl font-medium'>
                  <Link href='/disclaimer'>Disclaimer</Link>
                </li>
                <li className='text-xl font-medium'>
                  <Link href='/terms-of-use'>Terms of Use</Link>
                </li>
                <li className='text-xl font-medium'>
                  <Link href='/cookie-policy'>Cookie Policy</Link>
                </li>
                <li className='text-xl font-medium'>
                  <a href='mailto:durgashashinadhwork@gmail.com'>Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-y-2 md:py-4 border-gray-200'>
            <motion.svg
              width='500'
              ref={ref}
              height='120'
              viewBox='0 18.4 171.55 34.1'
              fill='none'
              className='sm:h-fit h-20 md:px-8 px-2 footer-logo w-full'
              xmlns='http://www.w3.org/2000/svg'
              initial='hidden'
              animate={isInView ? 'visible' : 'hidden'}
            >
              {pathArr.map((path, index) => (
                <motion.path
                  key={index}
                  custom={index}
                  variants={variants}
                  d={path}
                  fill='#000000'
                />
              ))}
            </motion.svg>
          </div>
          <div className='flex md:flex-row flex-col-reverse gap-3 justify-between py-2'>
            <span className='font-medium'>
              &copy; {new Date().getFullYear()} JobLess. All Rights Reserved.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer; 
 