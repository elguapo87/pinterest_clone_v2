import React from 'react'
import Layers from './Layers';
import Workspace from './Workspace';
import Options from './Options';

type CreatePageProps = {
  url: string;
  width: number;
  height: number;
} | null;

const PinEditor = ({ previewImage }: { previewImage: CreatePageProps }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 pb-10">
      <div className="flex-1">
        <Layers previewImage={previewImage} />
      </div>
      <div className="flex-1 md:flex-3">
        <Workspace previewImage={previewImage} />
      </div>
      <div className="flex-1">
        <Options previewImage={previewImage} />
      </div>
    </div>
  )
}

export default PinEditor
