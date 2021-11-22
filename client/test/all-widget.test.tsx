import * as React from 'react';
import {
  Alert,
  Heading,
  Container,
  Row,
  ColumnCentre,
  Column,
  Card,
  CategoryCard,
  ReviewCard,
  FullReviewCard,
  ThumbNail,
  JustifiedNavBar,
  NavBarLink,
  FormContainer,
  FormGroup,
  Form,
  Button,
  Linebreak,
} from '../src/widgets';
import { NavLink } from 'react-router-dom';
import { shallow } from 'enzyme';
import { createHashHistory } from 'history';

export const history = createHashHistory();

describe('Form tests', () => {
  test('Form container', () => {
    const wrapper = shallow(<FormContainer></FormContainer>);
    expect(wrapper.matchesElement(<form></form>)).toEqual(true);
  });
  test('Form group', () => {
    const wrapper = shallow(<FormGroup></FormGroup>);
    expect(wrapper.matchesElement(<div className="form-group"></div>)).toEqual(true);
  });
  test('Form label', () => {
    const wrapper = shallow(<Form.Label></Form.Label>);
    expect(wrapper.matchesElement(<label className="col-form-label mx-2"></label>)).toEqual(true);
  });
  test('Form input', () => {
    const wrapper = shallow(
      <Form.Input
        placeholder="Skriv inn tittel"
        type="text"
        value="title"
        onChange={(event) => {
          ('');
        }}
      ></Form.Input>
    );
    expect(
      wrapper.matchesElement(
        <input className="form-control" placeholder="Skriv inn tittel" type="text" value="title" />
      )
    ).toEqual(true);
  });

  test('Form textarea', () => {
    const wrapper = shallow(
      <Form.Textarea
        value="title"
        onChange={(event) => {
          ('');
        }}
      ></Form.Textarea>
    );
    expect(wrapper.matchesElement(<textarea className="form-control" value="title" />)).toEqual(
      true
    );
  });
  test('Form select', () => {
    const wrapper = shallow(
      <Form.Select
        value="title"
        onChange={(event) => {
          ('');
        }}
      ></Form.Select>
    );
    expect(
      wrapper.matchesElement(
        <select className="custom-select" value="title">
          <option hidden>Velg her: </option>
        </select>
      )
    ).toEqual(true);
  });
});

describe('Linebreak tests', () => {
  test('Linebreak renders jumbatron header', () => {
    const wrapper = shallow(<Linebreak></Linebreak>);
    expect(wrapper.matchesElement(<br />)).toEqual(true);
  });
});

describe('Heading tests', () => {
  test('Heading renders jumbatron header', () => {
    const wrapper = shallow(<Heading header={true}></Heading>);
    expect(
      wrapper.matchesElement(
        <div className="container text-center jumbotron my-3">
          <div className="jumbotron">
            <h1 className="display-1 text-underline">GameShed</h1>
            <h2 className="display-5">Nettstedet for spillanmeldelser</h2>
          </div>
        </div>
      )
    ).toEqual(true);
  });
});

describe('Button tests', () => {
  test('Button success', () => {
    const wrapper = shallow(
      <Button.Success
        onClick={() => {
          'click';
        }}
      ></Button.Success>
    );
    expect(
      wrapper.matchesElement(<button type="button" className="btn btn-success"></button>)
    ).toEqual(true);
  });
  /**
   * test('button click', (done) => {
    const wrapper = shallow(<Button.Success onClick={()=>{history.push('/')}}></Button.Success>);

    // Wait for events to complete
    setTimeout(() => {

      wrapper.find('.btn').simulate('click');

      expect(window.location.pathname).toEqual('/');

      done();
    });
  });
   */
});

describe('Container tests', () => {
  test('Container aligns text center', () => {
    const wrapper = shallow(<Container textalign="center"></Container>);
    expect(
      wrapper.matchesElement(<div className="container my-5 mx-auto text-center"></div>)
    ).toEqual(true);
  });
});

describe('ColoumnCentre tests', () => {
  test('ColumnCentre width test', () => {
    const wrapper = shallow(<ColumnCentre width={3}></ColumnCentre>);
    expect(wrapper.matchesElement(<div className="col-3"></div>)).toEqual(true);
  });
});

describe('Thumbnail tests', () => {
  test('Thumbnail render test', () => {
    const wrapper = shallow(<ThumbNail img="image.html"></ThumbNail>);
    expect(wrapper.matchesElement(<img className="img-thumbnail" src="image.html" />)).toEqual(
      true
    );
  });
});

describe('Card render tests', () => {
  test('Card renders correctly', () => {
    const wrapper = shallow(<Card title="card-test"></Card>);
    expect(
      wrapper.matchesElement(
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">card-test</h5>
            <div className="card-text"></div>
          </div>
        </div>
      )
    ).toEqual(true);
  });
  test('CategoryCard renders correctly', () => {
    const wrapper = shallow(<CategoryCard img="test-image.html"></CategoryCard>);
    expect(
      wrapper.matchesElement(
        <div className="card border-success my-2">
          <div className="card-body text-center">
            <img
              className="card-img-top d-block mx-auto w-25"
              src="test-image.html"
              alt="Card image cap"
            />
          </div>
        </div>
      )
    ).toEqual(true);
  });
  test('ReviewCard renders correctly', () => {
    const wrapper = shallow(
      <ReviewCard
        title="review-title"
        subtitle="review-subtitle"
        text="review-text"
        terningkast={5}
        relevanse={2}
      ></ReviewCard>
    );

    expect(wrapper).toMatchSnapshot();
    //    expect(
    //      wrapper.matchesElement(
    //        <div className="card border-success my-2">
    //        <Row>
    //          <Column width={2} offset={10} right>
    //            <ThumbNail
    //              small
    //              img={'https://helenaagustsson.github.io/INFT2002-images/images/star.png'}
    //            ></ThumbNail>
    //
    //            {' ' + 2}
    //          </Column>
    //        </Row>
    //        <div className="card-body pt-0">
    //          <Row>
    //            <ColumnCentre width={11}>
    //              <h5 className="card-title">
    //                review-title
    //                <ThumbNail
    //                  small
    //                  img="https://helenaagustsson.github.io/INFT2002-images/images/dice-5.png"
    //                ></ThumbNail>
    //              </h5>
    //              <h6 className="card-subtitle mb-2 text-muted">Spill: review-subtitle</h6>
    //            </ColumnCentre>
    //          </Row>
    //          <Row>
    //            <ColumnCentre width={12}>
    //              <div className="card-text">review-text...</div>
    //            </ColumnCentre>
    //          </Row>
    //        </div>
    //      </div>
    //
    //      )
    //    ).toEqual(true);
  });
});

describe('Full Review Card', () => {
  test('Full review card renders correctly', () => {
    const wrapper = shallow(
      <FullReviewCard
        title="review-title"
        subtitle="review-subtitle"
        text="review-text"
        terningkast={5}
        relevanse={2}
        img="img.png"
      ></FullReviewCard>
    );
    expect(wrapper).toMatchSnapshot();
    //    expect(
    //      wrapper.matchesElement(
    //        <div className="card border-success my-2">
    //        <Row>
    //          <Column width={2} offset={10} right>
    //            <ThumbNail
    //              small
    //              img={'https://helenaagustsson.github.io/INFT2002-images/images/star.png'}
    //            ></ThumbNail>
    //
    //            {' ' + 2}
    //          </Column>
    //        </Row>
    //        <div className="card-body pt-0">
    //          <Row>
    //            <ColumnCentre width={11}>
    //              <h5 className="card-title">
    //                {'review-title' + ' '}
    //                <ThumbNail
    //                  small
    //                  img={
    //                    'https://helenaagustsson.github.io/INFT2002-images/images/dice-5.png'
    //
    //                  }
    //                ></ThumbNail>
    //              </h5>
    //              <h6 className="card-subtitle mb-2 text-muted">Spill: review-subtitle</h6>
    //            </ColumnCentre>
    //          </Row>
    //          <Row>
    //            <ColumnCentre width={2}>
    //              <ThumbNail img='img.png'></ThumbNail>
    //            </ColumnCentre>
    //            <ColumnCentre width={9}>
    //              <div className="card-text">review-text</div>
    //            </ColumnCentre>
    //          </Row>
    //
    //        </div>
    //      </div>
    //      )
    //    ).toEqual(true);
  });
});

describe('JustifiedNavbar tests', () => {
  test('Justified Navbar right', () => {
    const wrapper = shallow(<JustifiedNavBar justify="right" brand="GS"></JustifiedNavBar>);
    expect(
      wrapper.matchesElement(
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <div className="container-fluid justify-content-right">
            <NavLink className="navbar-brand" activeClassName="active" exact to="/">
              GS
            </NavLink>
            <div className="navbar-nav"></div>
          </div>
        </nav>
      )
    ).toEqual(true);
  });
});

describe('Alert tests', () => {
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });

  test('Close alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').simulate('click');

      expect(wrapper.matchesElement(<div></div>)).toEqual(true);

      done();
    });
  });
});
