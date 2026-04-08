
export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-black">
          <hr className='my-6 border-gray-200 sm:mx-auto  lg:my-4' />

        <div className='sm:flex sm:items-center sm:justify-between mb-4 mx-2'>
          <div className='flex flex-col gap-1'>
            <span className='text-sm text-gray-100 sm:text-center '>
              © 2026{' '}
              <a
                href='https://controller.lacity.gov'
                className='p-0 hover:text-[#41ffca] hover:underline text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded'
              >
                Kenneth Mejia, Los Angeles City Controller
              </a>
              . All Rights Reserved.
            </span>
            <span>
              <a
                href='https://disclaimer.lacity.gov/accessibility.htm'
                className='p-0 text-sm hover:text-[#41ffca] hover:underline text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded'
              >
                Citywide Accessibility Statement
              </a>
            </span>
          </div>
          <nav className='mt-4 flex space-x-6 text-[#41ffca] sm:mt-0 sm:justify-center' aria-label="Social media links">
            <a
              href='https://www.facebook.com/lacontroller'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Visit us on Facebook (opens in new window)'
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 320 512'
                className='h-7 w-7 text-[#41ffca]'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fill='currentColor'
                  d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'
                />
              </svg>
            </a>

            {/*  instagram */}
            <a
              href='https://www.instagram.com/lacontroller'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Visit us on Instagram (opens in new window)'
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 448 512'
                className='h-7 w-7 text-[#41ffca]'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fill='currentColor'
                  d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'
                />
              </svg>
            </a>
            {/* tiktok */}
            <a
              href='https://www.tiktok.com/@lacontrollermejia'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Visit us on TikTok (opens in new window)'
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 448 512'
                className='h-7 w-7 text-[#41ffca]'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fill='currentColor'
                  d='M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z'
                />
              </svg>
            </a>

            {/* twitter */}
            <a
              href='https://twitter.com/lacontroller'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Visit us on Twitter (opens in new window)'
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='29'
                height='29'
                fill='currentColor'
                className='bi bi-twitter-x'
                viewBox='0 0 16 16'
                aria-hidden='true'
              >
                <path d='M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z' />
              </svg>
            </a>
            {/* bluesky */}
            <a
              href='https://bsky.app/profile/controller.lacity.gov'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Visit us on Bluesky (opens in new window)'
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              <svg
                width='29'
                height='29'
                viewBox='28 -20 550 550'
                xmlns='http://www.w3.org/2000/svg'
                preserveAspectRatio='xMidYMid meet'
                className='h-7 w-9'
                aria-hidden='true'
                fill='currentColor'
              >
                <path d='M135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z' />
              </svg>
            </a>
          </div>
        </div>
      </footer>
  );
}
