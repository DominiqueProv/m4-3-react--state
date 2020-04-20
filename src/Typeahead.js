import React from 'react';
import styled from 'styled-components';

import Button from './Button';

const Typeahead = ({
    suggestions,
    categories,
    maxResults = 6,
    handleSelect,
}) => {
    const [value, setValue] = React.useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = React.useState(
        0
    );

    let matchedSuggestions = suggestions
        .filter(suggestion => {
            // Don't show any suggestions if:
            // - the user has typed 0 or 1 letter (at least 2)
            // - The title contains the value the user has typed (case insensitive)
            const hasEnteredEnoughCharacters = value.length >= 2;
            const includesValue = suggestion.title
                .toLowerCase()
                .includes(value.toLowerCase());

            return hasEnteredEnoughCharacters && includesValue;
        })
        // We want to limit the results to the first few, based on the
        // `maxResults` prop.
        .slice(0, maxResults);

    const shouldShowSuggestions = matchedSuggestions.length > 0 && isVisible;

    const selectedSuggestion = matchedSuggestions[selectedSuggestionIndex];

    return (
        <Wrapper>
            <Row>
                <Input
                    type="text"
                    value={value}
                    onChange={ev => {
                        setValue(ev.target.value);
                    }}
                    onFocus={() => {
                        setIsVisible(true);
                    }}
                    onBlur={() => {
                      setIsVisible(false);
                    }}
                    onKeyDown={ev => {
                        switch (ev.key) {
                            // If the user presses the "enter" key, take the currently
                            // selected result.
                            case 'Enter': {
                                handleSelect(selectedSuggestion);
                                return;
                            }

                            // Escape should close the typeahead.
                            case 'Escape': {
                                setIsVisible(false);
                                return;
                            }

                            // Arrows should shift between the available suggestions.
                            // We use arrow keys instead of `tab` so that keyboard users can
                            // choose to either enter the list of suggestions, or tab to the
                            // rest of the page.
                            case 'ArrowUp':
                            case 'ArrowDown': {
                                ev.preventDefault();

                                // If the user's entry doesn't match any suggestions, there's
                                // no use trying to shift between them!
                                if (!matchedSuggestions) {
                                    return;
                                }

                                const direction = ev.key === 'ArrowDown' ? 'down' : 'up';

                                // Inherit the current selected index.
                                // We create a copy so that we can modify it without
                                // accidentally mutating state, which is a no-no
                                let nextSuggestionIndex = selectedSuggestionIndex;

                                nextSuggestionIndex =
                                    direction === 'down'
                                        ? nextSuggestionIndex + 1
                                        : nextSuggestionIndex - 1;

                                // If the user is on the very first item and they try to go
                                // up, we don't want to select negative indices. Clamp it to
                                // the range of possible values.
                                // (`clamp` is a utility function I defined, find it in
                                // `utils.js`)
                                nextSuggestionIndex = clamp(
                                    nextSuggestionIndex,
                                    0,
                                    matchedSuggestions.length - 1
                                );

                                setSelectedSuggestionIndex(nextSuggestionIndex);
                                return;
                            }

                            // If the user previously typed `Escape` to close the typeahead,
                            // and then they type any other letter or character, we should
                            // reopen it.
                            default: {
                                setIsVisible(true);
                                return;
                            }
                        }
                    }}
                    aria-expanded={isVisible}
                    aria-owns="results"
                    aria-label="Search for a book"
                    aria-describedby="typeahead-instructions"
                    aria-activedescendant={
                        selectedSuggestion ? `option-${selectedSuggestion.id}` : undefined
                    }
                />
                <ClearButton
                    onClick={() => {
                        setValue('');
                    }}
                >
                    Clear
        </ClearButton>
            </Row>
            {shouldShowSuggestions && (
                <Suggestions id="results">
                    {matchedSuggestions.map((suggestion, index) => {

                        const category = categories[suggestion.categoryId];
                        const isSelected = index === selectedSuggestionIndex;

                        return (
                            <>
                                <Suggestion
                                    key={suggestion.id}
                                    suggestion={suggestion}
                                    category={category}
                                    index={index}
                                    isSelected={isSelected}
                                    searchValue={value}
                                    // onMouseEnter={() => {
                                    //     setSelectedSuggestionIndex(index);
                                    // }}
                                    onMouseDown={() => {
                                        handleSelect(suggestion);
                                    }}
                                />
                            </>
                        );
                    })}
                </Suggestions>
            )}
            <ForScreenReaders id="typeahead-instructions">
                When autocomplete results are available use up and down arrows to review
                and enter to select. Touch device users, explore by touch or with swipe
                gestures.
      </ForScreenReaders>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
`;

const Row = styled.div`
    display: flex;
`;

const ClearButton = styled(Button)`
    margin-left: 10px;
`;

const Input = styled.input`
    width: 350px;
    height: 40px;
    padding: 0 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 18px;
`;

const Suggestions = styled.div`
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    bottom: -10px;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(100%);
`;

const ForScreenReaders = styled.span`
    display: none;
`;

export default Typeahead;
