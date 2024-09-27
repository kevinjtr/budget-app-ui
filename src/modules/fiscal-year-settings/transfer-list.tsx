import * as React from 'react';
import { connect } from "redux-bundler-react";
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import {Card, CardHeader, Divider} from '@mui/material';
import filter from 'lodash/filter'
import differenceBy from 'lodash/differenceBy'

function not(a: readonly number[], b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function TransferList({projectItems, orgsByRoute, changes, setChanges}) {

  const initialValues = {
    unlocked: filter(projectItems,function(p){return !p.locked}),
  }

  const [checked, setChecked] = React.useState<readonly number[]>([]);
  const [unlocked, setUnlocked] = React.useState(initialValues.unlocked)
  const [locked, setLocked] = React.useState(filter(projectItems,function(p){return p.locked}))
  const unlockedChecked = intersection(checked, unlocked);
  const lockedChecked = intersection(checked, locked);

  React.useEffect(() => setChanges(differenceBy(initialValues.unlocked, unlocked, 'id')),[unlocked])

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setLocked(locked.concat(unlocked));
    setUnlocked([]);
  };

  const handleCheckedRight = () => {
    setLocked(locked.concat(unlockedChecked));
    setUnlocked(not(unlocked, unlockedChecked));
    setChecked(not(checked, unlockedChecked));
  };

  const handleCheckedLeft = () => {
    setUnlocked(unlocked.concat(lockedChecked));
    setLocked(not(locked, lockedChecked));
    setChecked(not(checked, lockedChecked));
  };

  const handleAllLeft = () => {
    setUnlocked(unlocked.concat(locked));
    setLocked([]);
  };

  const numberOfChecked = (items) =>
    intersection(checked, items).length;

  const customList = (items, title: string) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        // avatar={
        //   <Checkbox
        //     onClick={handleToggleAll(items)}
        //     checked={numberOfChecked(items) === items.length && items.length !== 0}
        //     indeterminate={
        //       numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
        //     }
        //     disabled={items.length === 0}
        //     inputProps={{
        //       'aria-label': 'all items selected',
        //     }}
        //   />
        // }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;
          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.p2Id} - ${value.name}`} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
    </Card>
  );

  return (
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{customList(unlocked,"Unlocked")}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={unlocked.length === 0}
              aria-label="move all locked"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={unlockedChecked.length === 0}
              aria-label="move selected locked"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={lockedChecked.length === 0}
              aria-label="move selected unlocked"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={locked.length === 0}
              aria-label="move all unlocked"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList(locked,"Locked")}</Grid>
      </Grid>
  );
}

export default connect(
  "selectOrgsByRoute",
  "selectProjectItems",
  TransferList
);

