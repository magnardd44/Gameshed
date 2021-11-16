import * as React from 'react';
import { ReactNode, ChangeEvent } from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

/**
 * boostrap header
 * 
                  
 */
export class Heading extends Component<{ header?: boolean }> {
  render() {
    return (
      <div
        className="container text-center jumbotron my-3"
        style={
          this.props.header
            ? {
                color: '#24272bff',
                fontFamily: 'Road Rage, cursive',
                fontSize: '',
              }
            : {}
        }
      >
        {this.props.children}
        <div className="jumbotron">
          <h1 className="display-1 text-underline">GameShed</h1>
          <h2 className="display-5">Nettstedet for spillanmeldelser</h2>
        </div>
      </div>
    );
  }
}

/**
 * container for pages
 */

export class Container extends Component<{ textalign?: string }> {
  render() {
    return (
      <div
        className={
          'container my-5 mx-auto text' + (this.props.textalign ? '-' + this.props.textalign : '')
        }
      >
        {this.props.children}
      </div>
    );
  }
}

export class DropDown extends Component {
  render() {
    return (
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Dropdown button
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export class FormContainer extends Component {
  render() {
    return <form>{this.props.children}</form>;
  }
}

export class FormGroup extends Component {
  render() {
    return <div className="form-group">{this.props.children}</div>;
  }
}

export class ThumbNail extends Component<{ small?: boolean; img: string }> {
  render() {
    return (
      <img
        className="img-thumbnail"
        src={this.props.img}
        style={
          this.props.small
            ? {
                height: '16px',
                display: 'inline',
                padding: '0px',
              }
            : {}
        }
      />
    );
  }
}

export class Linebreak extends Component {
  render() {
    return <br />;
  }
}

/**
 * Renders an information card using Bootstrap classes.
 *
 * Properties: title
 */
export class Card extends Component<{ title: ReactNode }> {
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{this.props.title}</h5>
          <div className="card-text">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export class CategoryCard extends Component<{ title?: ReactNode; img: string }> {
  render() {
    return (
      <div className="card border-success my-2">
        <div className="card-body text-center">
          <img
            className="card-img-top d-block mx-auto w-25"
            src={this.props.img}
            alt="Card image cap"
          />
        </div>
        {this.props.children}
      </div>
    );
  }
}

export class ReviewCard extends Component<{
  title: ReactNode;
  subtitle?: string;
  text?: string;
  terningkast?: number;
  relevanse?: number;
}> {
  render() {
    return (
      <div className="card border-success my-2">
        <Row>
          <Column width={2} offset={10} right>
            <ThumbNail
              small
              img={'https://helenaagustsson.github.io/INFT2002-images/images/star.png'}
            ></ThumbNail>

            {' ' + this.props.relevanse}
          </Column>
        </Row>
        <div className="card-body pt-0">
          <Row>
            <ColumnCentre width={11}>
              <h5 className="card-title">
                {this.props.title + ' '}
                <ThumbNail
                  small
                  img={
                    'https://helenaagustsson.github.io/INFT2002-images/images/dice-' +
                    this.props.terningkast +
                    '.png'
                  }
                ></ThumbNail>
              </h5>
              <h6 className="card-subtitle mb-2 text-muted">Spill: {this.props.subtitle}</h6>
            </ColumnCentre>
          </Row>
          <Row>
            <ColumnCentre width={12}>
              <div className="card-text">
                {this.props.text?.substr(0, 175) + '... '}
                {this.props.children}
              </div>
            </ColumnCentre>
          </Row>
        </div>
      </div>
    );
  }
}

/**
 * Renders a row using Bootstrap classes.
 */
export class Row extends Component {
  render() {
    return <div className="row">{this.props.children}</div>;
  }
}

export class ColumnCentre extends Component<{
  width?: number;
  offset?: number;
  smwidth?: number;
  mdwidth?: number;
}> {
  render() {
    return (
      <div
        className={
          'col' +
          (this.props.width ? '-' + this.props.width : '') +
          (this.props.smwidth ? ' col-sm-' + this.props.smwidth : '') +
          (this.props.mdwidth ? ' col-md-' + this.props.mdwidth : '') +
          (this.props.offset ? ' offset-' + this.props.offset : '')
        }
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * Renders a column with specified width using Bootstrap classes.
 *
 * Properties: width, right
 */
export class Column extends Component<{ width?: number; right?: boolean; offset?: number }> {
  render() {
    return (
      <div
        className={
          'col-sm' +
          (this.props.width ? '-' + this.props.width : '') +
          (this.props.offset ? ' offset-' + this.props.offset : '')
        }
      >
        <div className={'float-' + (this.props.right ? 'end' : 'start')}>{this.props.children}</div>
      </div>
    );
  }
}

/**
 * Renders a success button using Bootstrap styles.
 *
 * Properties: small, onClick
 */
class ButtonSuccess extends Component<{ small?: boolean; onClick: () => void }> {
  render() {
    return (
      <button
        type="button"
        className="btn btn-success"
        style={
          this.props.small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
                display: 'inline',
              }
            : {}
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a danger button using Bootstrap styles.
 *
 * Properties: small, onClick
 */
class ButtonDanger extends Component<{ small?: boolean; onClick: () => void }> {
  render() {
    return (
      <button
        type="button"
        className="btn btn-danger"
        style={
          this.props.small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
              }
            : {}
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a light button using Bootstrap styles.
 *
 * Properties: small, onClick
 */
class ButtonLight extends Component<{ small?: boolean; onClick: () => void }> {
  render() {
    return (
      <button
        type="button"
        className="btn btn-light"
        style={
          this.props.small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
              }
            : {}
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a button using Bootstrap styles.
 *
 * Properties: onClick
 */
export class Button {
  static Success = ButtonSuccess;
  static Danger = ButtonDanger;
  static Light = ButtonLight;
}

/**
 * Renders a NavBar link using Bootstrap styles.
 *
 * Properties: to
 */
export class NavBarLink extends Component<{ to: string }> {
  render() {
    return (
      <NavLink className="nav-link" activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    );
  }
}

/**
 * Renders a NavBar using Bootstrap classes.
 *
 * Properties: brand
 */
export class JustifiedNavBar extends Component<{ brand?: ReactNode; justify?: string }> {
  static Link = NavBarLink;

  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className={'container-fluid justify-content-' + this.props.justify}>
          <NavLink
            className="navbar-brand"
            activeClassName="active"
            exact
            to="/"
            style={
              this.props.brand
                ? {
                    color: '#24272bff',
                    fontFamily: 'Road Rage, cursive',
                    fontSize: '2rem',
                  }
                : {}
            }
          >
            {this.props.brand}
          </NavLink>
          <div className="navbar-nav">{this.props.children}</div>
        </div>
      </nav>
    );
  }
}

export class NavBar extends Component<{ brand: ReactNode; justify?: string }> {
  static Link = NavBarLink;

  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className="container-fluid justify-content-start">
          <NavLink className="navbar-brand" activeClassName="active" exact to="/">
            {this.props.brand}
          </NavLink>
          <div className="navbar-nav">{this.props.children}</div>
        </div>
      </nav>
    );
  }
}

/**
 * Renders a form label using Bootstrap styles.
 */
class FormLabel extends Component {
  render() {
    return <label className="col-form-label mx-2">{this.props.children}</label>;
  }
}

/**
 * Renders a form input using Bootstrap styles.
 */
class FormInput extends Component<{
  type: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, width, height, pattern
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { type, value, onChange, ...rest } = this.props;
    return (
      <input
        {...rest}
        className="form-control"
        type={this.props.type}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

/**
 * Renders a form textarea using Bootstrap styles.
 */
class FormTextarea extends React.Component<{
  value: string | number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, rows, cols
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { value, onChange, ...rest } = this.props;
    return <textarea {...rest} className="form-control" value={value} onChange={onChange} />;
  }
}

/**
 * Renders a form checkbox using Bootstrap styles.
 */
class FormCheckbox extends Component<{
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, width, height, pattern
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { checked, onChange, ...rest } = this.props;
    return (
      <input
        {...rest}
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    );
  }
}

/**
 * Renders a form select using Bootstrap styles.
 */
class FormSelect extends Component<{
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, size.
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { value, onChange, children, ...rest } = this.props;
    return (
      <select {...rest} className="custom-select" value={value} onChange={onChange}>
        {children}
      </select>
    );
  }
}

/**
 * Renders form components using Bootstrap styles.
 */
export class Form {
  static Label = FormLabel;
  static Input = FormInput;
  static Textarea = FormTextarea;
  static Checkbox = FormCheckbox;
  static Select = FormSelect;
}

/**
 * Renders alert messages using Bootstrap classes.
 *
 * Students: this slightly more complex component is not part of curriculum.
 */
export class Alert extends Component {
  alerts: { id: number; text: ReactNode; type: string }[] = [];
  nextId: number = 0;

  render() {
    return (
      <div>
        {this.alerts.map((alert, i) => (
          <div
            key={alert.id}
            className={'alert alert-dismissible alert-' + alert.type}
            role="alert"
          >
            {alert.text}
            <button
              type="button"
              className="btn-close btn-sm"
              onClick={() => this.alerts.splice(i, 1)}
            />
          </div>
        ))}
      </div>
    );
  }

  /**
   * Show success alert.
   */
  static success(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'success' });
    });
  }

  /**
   * Show info alert.
   */
  static info(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'info' });
    });
  }

  /**
   * Show warning alert.
   */
  static warning(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'warning' });
    });
  }

  /**
   * Show danger alert.
   */
  static danger(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'danger' });
    });
  }
}
