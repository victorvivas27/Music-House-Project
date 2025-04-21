import PropTypes from "prop-types";
import "./ToolTipMy.css"


const TooltipMy = ({
    message = "Tooltip por defecto",
    backgroundColor = "green",
    textColor = "#fff",
    fontSize = "10px",
    fontFamily = "inherit",
    width = "200px",
    height = "auto",
    className = "",
    style = {},
    children,
  }) => {
    const cssVars = {
      "--tooltip-color": backgroundColor,
      "--tooltip-text-color": textColor,
      "--tooltip-font-size": fontSize,
      "--tooltip-font-family": fontFamily,
      "--tooltip-width": width,
      "--tooltip-height": height,
      ...style,
    };
  
    return (
      <div className={`tooltip-wrapper ${className}`}>
        <span className="tooltip" data-tooltip={message} id="anim" style={cssVars}>
          {children}
        </span>
      </div>
    );
  };
  
  TooltipMy.propTypes = {
    message: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    fontSize: PropTypes.string,
    fontFamily: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
  };
  
  export default TooltipMy;