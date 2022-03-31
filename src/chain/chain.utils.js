
import * as definitions_bifrost from './interfaces/bifrost';

let chainUtlis = {
    getTypes(chain) {
        let definitions = null;
        if (chain.toLowerCase() === 'bifrost') {
            definitions = definitions_bifrost;
        }
        if (definitions) {
            const types = Object.values(definitions).reduce(
                (res, { types }) => ({ ...res, ...types }),
                {},
            );
            return {
                ...types,
            };
        }
        return {};
    }

}
export default chainUtlis;
