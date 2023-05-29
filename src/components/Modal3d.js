import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StlViewer } from 'react-stl-viewer'
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { change3dShown, select3dShown } from '../redux/commonSlice';

const Modal3d = () => {
  const dispatch = useAppDispatch();
  const shown3d = useAppSelector(select3dShown);
  return (
    shown3d ? <div onClick={(e)=>{
      dispatch(change3dShown());
    }} className="Modal3dWrapper">
        <div onClick={(e)=>{
          e.stopPropagation();
          e.preventDefault();
        }} className="Modal3d">
        <StlViewer
                    style={{
                      boxShadow: "0 0 10px #000E",
                      width: "40vw",
                      height: "40vh",
                      backgroundColor: "#FFF"
                    }}
                    orbitControls
                    shadows
                    modelProps={{
                      scale: 1.5,
                      rotationY: Math.PI
                    }}
                    url={"/ceh.stl"}
                  /> 
            </div>
        </div>
                  : ""
  )
}

export default Modal3d