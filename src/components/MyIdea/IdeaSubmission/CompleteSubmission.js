/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useState, Component } from 'react';
import posed from 'react-pose';
import Button from '../../reogranisation/Questions/Button';
import request from 'superagent';
import { baseUrl } from '../../../constants';
import pdfAgreement from './participants_agreement.pdf';
import { Document, Page, pdfjs } from "react-pdf";
import { color } from 'style-value-types';
import { borderRadius } from 'react-select/lib/theme';
import { relative } from 'path';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const CompleteSubmission = (props) => {

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [agreeBttn, setAgreeBttn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitIdea = () => {
    setIsSubmitting(true);
    const dataToSend = props.groups.map((group, index) => {
      return {
        groupName: group.groupTitle,
        answers: group.questions.map((question) => {
          return {
            id: question.id,
            qTitle: question.text,
            qAnswer: props.answers[index.toString()][question.id],
          };
        }),
      };
    });

    request
      .post(`${baseUrl}/ideas`)
      .set("Authorization", `Bearer ${props.authState.token}`)
      .send({ idea: dataToSend })
      .then(res => {
        if (res.status === 201) {
          setDisplaySuccess(true);
        }
      })
      .catch(err => {
        if (err.status === 400) {
          // dispatch(userLoginFailed(err.response.body.message))
        } else {
          console.error(err);
        }
      });
  };

  if (displaySuccess) {
    return <GroupContainer>
      <FlexRow><FlexColumn><GroupTitle>Submission complete!</GroupTitle></FlexColumn></FlexRow>
      <FlexRow><FlexColumn><GroupSubtitle>We'll be in touch with you soon.</GroupSubtitle></FlexColumn></FlexRow>
    </GroupContainer>;
  }

  class Agreement extends Component {
    state = { numPages: null, pageNumber: 1 };

    onDocumentLoadSuccess = ({ numPages }) => {
      this.setState({ numPages });
    };

    goToPrevPage = () =>
      this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
    goToNextPage = () =>
      this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

    render() {
      const { pageNumber, numPages } = this.state;

      return (
        <div>
          <div style={{ width: 600 }}>
            <Document
              file={pdfAgreement}
              onLoadSuccess={this.onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} width={600} />
            </Document>
          </div>
          <br />
          <nav>
            <button style={{ backgroundColor: "inherit", color: "white", borderRadius: "10px" }}
              onClick={this.goToPrevPage}>Prev Page</button>
            <button style={{ backgroundColor: "inherit", color: "white", borderRadius: "10px" }}
              onClick={this.goToNextPage}>Next Page</button>
          </nav>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      );
    }
  }

  return (
    <GroupContainer>
      {/* <FlexRow><FlexColumn> */}
      <Agreement />
      <a href={pdfAgreement} download><Button text={'Download the Participants Agreement'}
        onClick={() => setAgreeBttn(true)} /></a>
      <Button text={'I agree'} onClick={submitIdea}
        disabled={!agreeBttn}
        withIcon />
      {/* </FlexColumn></FlexRow> */}
    </GroupContainer>
  );
};

const FlexRow = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  @media only screen and (orientation:portrait) { 
    flex-direction: column;
}
`;

const FlexColumn = styled.div`
  display: flex;
  flex: 1;
`;

const FormGroup = styled.div`
  padding: 5px 10px;
  flex: 1;
`;

const GroupTitle = styled.div`
  font-size: 30px;
  font-weight: 800;
  text-align: left;
  color: #ffffff;
  position:relative;
  padding: 5px 15px;
  flex: 1;
  margin-bottom: 16px;
`;

const GroupSubtitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
  position:relative;
  padding: 5px 15px;
  flex: 1;
  margin-bottom: 32px;
`;

const PGroupContainer = posed.div({
  preEnter: {
    x: 600,
    originX: '50%',
    originY: '50%',
    opacity: 0,
    scale: 0.69,
    transition: {
      default: { ease: 'easeInOut', duration: 400 },
    },
  },
  enter: {
    x: 0,
    originX: '50%',
    originY: '50%',
    opacity: 1.0,
    scale: 1.0,
    transition: {
      default: { ease: 'easeInOut', duration: 400 },
    },
  },
  exit: {
    x: -600,
    originX: '50%',
    originY: '50%',
    opacity: 0,
    scale: 0.69,
    transition: { ease: 'easeInOut', duration: 400 },
  },
});

const GroupContainer = styled(PGroupContainer)`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-evenly;
  flex-grow: 1;
`;

export default CompleteSubmission;