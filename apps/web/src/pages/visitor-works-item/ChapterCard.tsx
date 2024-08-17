import { useNavigate } from 'react-router-dom';
import { Card, Flex } from 'antd';

import type { WorkChapter } from '../../types';

import style from './style.module.scss';

type ChapterCardProps = {
  serialNumber: number;
  dataSource: WorkChapter;
};

function ChapterCard({ serialNumber, dataSource }: ChapterCardProps) {
  const navigate = useNavigate();

  return (
    <Card className={style.ChapterCard} size="small" hoverable onClick={() => navigate(`/articles/${dataSource.subjectId}`)}>
      <Flex className={style['ChapterCard-content']} align="stretch" justify="space-between">
        <div className={style['ChapterCard-sn']}>{serialNumber}</div>
        <div className={style['ChapterCard-main']}>
          <div className={style['ChapterCard-header']}>{dataSource.title}</div>
          <Flex className={style['ChapterCard-footer']} align="center" justify="space-between">
            {dataSource.description}
          </Flex>
        </div>
      </Flex>
    </Card>
  );
}

export default ChapterCard;
