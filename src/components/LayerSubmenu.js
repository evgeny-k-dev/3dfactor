import React from 'react'

const LayerSubmenu = ({children, level=0, icon, previewText, isOpened, ...props}) => {
    const style = {
        paddingLeft: (level*20),
        borderTop: level===0 ? "3px solid #555555" : "",
        borderBottom: level===0 ? "3px solid #555555" : "",

        
    }
  return (
    <div {...props} className={"LayerSubMenu"+(isOpened ? " opened" : "")}>
        <div className="LayerSubMenuPreview">
            <img className='LayerSubMenuIcon' src={icon} alt=""/>
            <p>{previewText}</p>
        </div>
        <div className={"LayerSubMenuContents"+(isOpened ? " opened" : "")}>
            {children}
        </div>
    </div>
  )
}

export default LayerSubmenu