import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { addObject, change3dShown, selectBusinessName, selectFloors, selectObjects, selectRooms, setBusinessName } from '../redux/commonSlice';
import LayerSubmenu from  './LayerSubmenu';
import filemap from '../filemap';
const Menus = () => {
    const dispatch = useAppDispatch();
    const businessName = useAppSelector(selectBusinessName);
    const floors = useAppSelector(selectFloors);
    const rooms = useAppSelector(selectRooms);
    const objects = useAppSelector(selectObjects);
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeSubCategory, setActiveSubCategory] = useState(0);
    const [objectsOpened, setObjectsOpened] = useState(false);
    console.log(filemap.entries);
    let test = [];
  return (
    <div className="Menus">
        <div className='MenusHeader'>
            <input value={businessName} onChange={(e)=>dispatch(setBusinessName(e.target.value))} placeholder='Название цеха' type="text" />
        </div>
        <div className="MenusContent">
           <LayerSubmenu isOpened={objectsOpened} onClick={(e)=>{
            setObjectsOpened(!objectsOpened)
           }} previewText='Объекты'>
           {/* {objects.map((el, key)=>(
            <LayerSubmenu icon={el.src} previewText={<>
             {el.src==="/svg/water.svg" ? "Источник воды" : el.src==="/svg/power.svg" ? "Источник электричества" : el?.text}
            </>}/>
           ))} */}
            </LayerSubmenu> 
        </div>
        <div className='CategoriesWrap'>
          {Object.keys(filemap.entries).map((el,key)=>{
            console.log(el);
            return <button onClick={()=>{setActiveCategory(key)}} className={activeCategory===key ? "active" : ""} key={key}>{filemap.entries[el].name}</button>
          })}
        </div>
        <div className='PlaceableObjects'>
          {Object.keys(filemap.entries).map((el,key)=>{
            if (key===activeCategory){
            return Object.keys(filemap.entries[el].entries).map((el2,key2)=>{
              console.log(key,
                 filemap.entries[el].entries[el2].isFile,
                 '/objects/'+filemap.entries[el].name+"/"+filemap.entries[el].entries[el2].name
                 );
              if (filemap.entries[el].entries[el2].isFile){
                const image = '/objects/'+filemap.entries[el].name+"/"+filemap.entries[el].entries[el2].name;
                return <LayerSubmenu onDoubleClick={(e)=>{
                  e.stopPropagation();
                  dispatch(addObject({
                    x: 0,
                    y: 0,
                    src: image,
                    objectType: filemap.entries[el].entries[el2].base
                  }))
                }} key={key2} icon={image} previewText={filemap.entries[el].entries[el2].base}/>
              }
              else {
                const current = filemap.entries[el].entries[el2];
                return Object.keys(current.entries).map((el3, key3)=>{
                  const image = '/objects/'+
                  filemap.entries[el].name+"/"+
                  filemap.entries[el].entries[el2].name+"/"+
                  filemap.entries[el].entries[el2].entries[el3].name;
                  return <LayerSubmenu onClick={(e)=>{
                    e.stopPropagation();
                    dispatch(addObject({
                      x: 0,
                      y: 0,
                      src: image,
                      objectType: current.entries[el3].base
                    }))
                  }} key={key3} icon={image
                  } previewText={current.entries[el3].base}></LayerSubmenu>
                })
              }
            })
          }
          else return ""
          }).flat()}
        </div>
        {/* {filter.isFile ? filter[el].base : filter[el].name} */}
        <div className="LowerButtons">
          <div className="LB_UpperButtonsWrap">
            <button onClick={(e)=>{
              dispatch(change3dShown());
            }} className="3dButton">
              <p>3D превью</p>
            </button>
            <button className="saveButton">
              <p>Сохранить в лк</p>
            </button>
          </div>
          <button className="exportButton">
              <p>Экспорт в 2D</p>
          </button>
        </div>
    </div>
  )
}

export default Menus