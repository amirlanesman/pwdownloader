'use client';
import { useState } from 'react';
import Head from 'next/head'

// const inter = Inter({ subsets: ['latin'] })
// const poppins = Poppins({ subsets: ['latin'] })

const IndexPage = () => {
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setErrorMessage('');
  };

  const handleDownload = async () => {
    if (!isValidInput(input)) {
      setErrorMessage('Invalid input. Please enter a URL or a single alphanumeric word.');
      return;
    }

    // Rest of the code for downloading the GPX file
    try {
      const response = await fetch(`/api/fetch-pw-data?url=${encodeURIComponent(input)}`);
      const gpxData = await response.text();

      const element = document.createElement('a');
      const file = new Blob([gpxData], { type: 'application/gpx+xml' });
      element.href = URL.createObjectURL(file);
      element.download = 'predictwind-track.gpx';
      element.click();
    } catch (error) {
      console.error('Error downloading GPX:', error);
    }
  };

  const isValidInput = (input) => {
    const alphanumericPattern = /^[a-z0-9]+$/i;
    const urlPattern1 = /^https:\/\/forecast.predictwind.com\/tracking\/display\/[a-z0-9_]+\/?$/i;
    const urlPattern2 = /^https:\/\/forecast.predictwind.com\/vodafone\/[a-z0-9_]+\.json\/?$/i;

    return alphanumericPattern.test(input) || urlPattern1.test(input) || urlPattern2.test(input);
  };

  return (
    <div class="section">
      <Head>
        <title>PredictWind Track Downloader</title>
      </Head>
      <div class="container">
        <div class="row full-height justify-content-center">
          <div class="col-12 text-center align-self-center py-5">
            <div class="section pb-5 pt-5 pt-sm-2 text-center">
              <div class="card-3d-wrap mx-auto">
                <div class="card-3d-wrapper">
                  <div class="card-front">
                    <div class="center-wrap">
                      <div class="section text-center">
                        <h4 class="mb-4 pb-3">Download your PredictWind track as GPX</h4>
                        <div class="form-group">
                          <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Your PredictWind tracker URL"
                            class="form-style"
                          />
                        </div>
                        <a href="#" onClick={handleDownload} class="btn mt-8">Download GPX</a>
                        {errorMessage && <p class="mb-0 mt-4 text-center">{errorMessage}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default IndexPage;
