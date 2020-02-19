import * as React from 'react'
import history from 'history/browser'

export const useLocation = (path: string) => {
  React.useEffect(() => {
    history.push(path);

    return () => {};
  }, [path]);
}